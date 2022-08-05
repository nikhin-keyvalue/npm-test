import Preact, { h, Fragment } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

import Footer from 'ui/components/footer/Footer';
import Header from 'ui/components/header/Header';
import Topbar from 'ui/components/topbar/Topbar';
import ConnectionInfo from 'ui/components/connection-info/ConnectionInfo';
import BottomSheet from 'ui/components/bottom-sheet/BottomSheet';
import GoBack from 'ui/components/bottom-sheet/go-back/GoBack';
import Loader from 'ui/components/loader/Loader';
import Modal from 'ui/components/modal/Modal';
import InstallationPopUp from 'ui/components/modal/installation-popup/InstallationPopUp';
import WalletPopUp from 'ui/components/modal/wallet-popup/WalletPopUp';
import TimeUpModal from 'ui/components/modal/timeup-modal/TimeUpModal';
import CoachLabel from 'ui/components/coach-label/CoachLabel';
import NetworkSelect from 'ui/components/network-select/NetworkSelect';
import ErrorModal from 'ui/components/modal/error-modal/ErrorModal';
import SessionInfo from 'ui/components/session-info/SessionInfo';
import Tutorial from 'ui/components/tutorial/Tutorial';
import { disconnectPhantom } from 'ui/wallets/Phantom';
import { useVisibilityChange } from 'ui/utils/hooks';
import { getBTCConnectionInfo, getSelectedWalletIcon, getSelectedWalletName, isMobileDevice } from 'ui/utils/common';
import { disconnectWalletConnect } from 'ui/wallets/WalletConnect';
import { getDeviceOS } from 'zamp/payment/utils';
import Payment from 'zamp/payment/Payment';
import {
  CANNOT_PROCESS_ERROR_PROPS,
  ErrorType,
  GENERIC_ERROR_PROPS,
  INVALID_ACCOUNT,
  INVALID_CHAIN_PROPS,
  ModalTypes,
  RiskStatus,
  ZampfiPages,
  Wallets,
  BottomSheetTypes,
  OS,
  GET_PAYMENT_POLLING_COUNT,
  METAMASK_PENDING_REQUEST_PROPS,
  DEFAULT_PAYMENT_TIME_LIMIT,
  SESSION_LOCAL_STORAGE_ID,
  ENVTypes,
  NO_BURNER_WALLET,
  Platform,
  APIErrorCode,
  SESSION_ENDED_LOCAL_STORAGE_ID
} from 'constants/common';
import { Balance, ChainTypes } from 'types/wallet';
import { ConnectionInformation, PaymentStatus, CoinData, AvailableNetworks, WalletData } from 'types';
import { CurrencyTypes, EthChains, SolChains, TokenTypes } from 'constants/wallet';
import { getEthBalancesArray, getSolBalancesArray, isSolChain, isValidBalance } from 'ui/utils/wallet';
import { ENV } from 'config';

import CoinList from './coin-list/CoinList';
import ErrorScreen from './error-screen/ErrorScreen';
import WalletList from './wallet-list/WalletList';
import SuccessScreen from './success-screen/SuccessScreen';
import PendingScreen from './pending-screen/PendingScreen';
import ExpiredScreen from './expired-screen/ExpiredScreen';
import BinanceScreen from './binance-screen/BinanceScreen';
import BitCoinScreen from './bitcoin-screen/BitCoinScreen';

import './style.scss';

type ContentProps = {
  onPaymentCompleted: (payload: PaymentStatus) => void;
  onPaymentCancel: () => void;
  // TODO: add type
  zampSession;
  paymentSession: Payment;
  isError: boolean;
};

declare global {
  interface Window {
    Android: any;
    IOS: any;
  }
}

const Content: Preact.FunctionComponent<ContentProps> = ({
  onPaymentCompleted,
  onPaymentCancel,
  zampSession,
  paymentSession,
  isError
}) => {
  let removeWalletListener: () => void = () => {};

  const getDefaultSelectedChain = () => {
    const defaultChainCode = zampSession.merchantConfig.default_network;

    const defaultChain = zampSession.merchantConfig.available_networks.find(
      (item) => item.network_code === defaultChainCode
    );

    return defaultChain as AvailableNetworks;
  };

  const filterRpcUrls = (availableNetworks: AvailableNetworks[]) =>
    availableNetworks.filter(
      (item) =>
        item.rpc_url && item.network_chain_id !== SolChains.DEVNET && item.network_chain_id !== SolChains.MAINNET
    );

  const [selectedWallet, setSelectedWallet] = useState<WalletData>({} as WalletData);
  const [selectedCoinObject, setSelectedCoinObject] = useState<CoinData>();
  const [selectedAmount, setSelectedAmount] = useState<string>('0');
  const [currentPage, setCurrentPage] = useState<ZampfiPages>(ZampfiPages.WALLET_LIST);
  const [address, setAddress] = useState<string | null>(null);
  const [currentChain, setCurrentChain] = useState<ChainTypes | null>(null);
  const [selectedChainObject, setSelectedChainObject] = useState<AvailableNetworks>(getDefaultSelectedChain());
  const [convertedAmounts, setConvertedAmounts] = useState<CoinData[]>();
  const [rpcUrls, setRpcUrls] = useState<Map<number, string>>();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isPaymentStarted, setIsPaymentStarted] = useState<boolean>(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInformation>();
  const [isBottomSheetOpen, setBottomSheetOpen] = useState<BottomSheetTypes | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<ModalTypes | null>(null);
  const [isDropDownActive, setDropDownActive] = useState(false);
  const [showBinanceTutorial, setShowBinanceTutorial] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [isExchangeRatesFetched, setIsExchangeRatesFetched] = useState(false);
  const [exchangeRatesExpiryTime, setExchangeRatesExpiryTime] = useState<Date>();

  const paymentTimeLimit = zampSession.merchantConfig.merchant.payment_time_limit || DEFAULT_PAYMENT_TIME_LIMIT;

  const containerRef = useRef(null);
  const pollingRef = useRef(0);
  const timerRef = useRef(0);

  const setRemoveWalletListener = (listener: () => void) => {
    removeWalletListener = listener;
  };

  useVisibilityChange((isVisible) => {
    if (isVisible && isSessionEnded()) setLocalStorageSession();
  });

  // TODO: move the whole timer states to Timer component as its now only dependent on endTime
  useEffect(() => {
    if (isExchangeRatesFetched && time < 1) onTimerCompleted();
  }, [time, isExchangeRatesFetched]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = 0;
    }

    if (exchangeRatesExpiryTime) {
      let currentDate = new Date();
      let timeLeftInMilliSeconds: number;
      let timeLeftInSeconds: number;

      timerRef.current = window.setInterval(() => {
        currentDate = new Date();
        timeLeftInMilliSeconds = exchangeRatesExpiryTime.valueOf() - currentDate.valueOf();
        timeLeftInSeconds = Number((timeLeftInMilliSeconds / 1000).toFixed(0));

        setTime(timeLeftInSeconds);
        setIsExchangeRatesFetched(true);
      }, 1000);
    }
  }, [exchangeRatesExpiryTime]);

  useEffect(() => {
    if (selectedChainObject && currentChain)
      if (currentChain === selectedChainObject.network_chain_id) setModalOpen(null);
      // Setting connectionInfo here will result in seamless coinList flow when user corrects chain in mobile.
      // But leads to unexpected cases of chain swap causing issues
      // TODO: trigger exchange rates fetch during chain correction without causing double patch call
      else if (currentPage === ZampfiPages.COIN_LIST) setModalOpen(ModalTypes.INVALID_CHAIN);
  }, [currentChain]);

  useEffect(() => {
    (async () => {
      if (convertedAmounts?.length)
        if (selectedWallet.name === Wallets.BINANCE && currentPage === ZampfiPages.WALLET_LIST) {
          setLoading(false);
          setCurrentPage(ZampfiPages.COIN_LIST);
        } else {
          await setAccountBalances();
        }
    })();
  }, [convertedAmounts]);

  useEffect(() => {
    if (connectionInfo)
      (async () => {
        setLoading(true);
        await paymentSession.updatePaymentInstance(connectionInfo);
        await getExchangeRate();
      })();
  }, [connectionInfo]);

  useEffect(() => {
    // Some cases WC triggers address change on payment start causing issues. This check prevents it.
    if (!isPaymentStarted)
      if (address) {
        if (currentChain === selectedChainObject.network_chain_id)
          (async () => {
            if (currentPage === ZampfiPages.COIN_LIST) {
              const newConnectionInfo: ConnectionInformation = {
                payment_option_id: selectedWallet.id,
                source_account: address,
                network_code: selectedChainObject.network_code
              };

              setConnectionInfo(newConnectionInfo);
            }
          })();
      } else if (currentPage !== ZampfiPages.WALLET_LIST) {
        setCurrentPage(ZampfiPages.WALLET_LIST);
      }
  }, [address]);

  useEffect(() => {
    if (isValidBalance(balances) && convertedAmounts?.length && currentPage === ZampfiPages.WALLET_LIST)
      setCurrentPage(ZampfiPages.COIN_LIST);

    setLoading(false);
  }, [balances]);

  // case arose as BTC flow initiated on selectedChainObject change
  useEffect(() => {
    clearInterval(pollingRef.current);
    pollingRef.current = 0;

    if (selectedChainObject.network_code === CurrencyTypes.BTC) setSelectedWallet({} as WalletData);
  }, [selectedChainObject]);

  useEffect(() => {
    clearInterval(pollingRef.current);
    pollingRef.current = 0;
  }, [currentPage]);

  useEffect(() => {
    setLocalStorageSession();

    const availableNetworks: AvailableNetworks[] = zampSession.merchantConfig.available_networks;
    const rpcObject = new Map(
      filterRpcUrls(availableNetworks).map((item) => [Number(item.network_chain_id), item.rpc_url])
    );

    setRpcUrls(rpcObject);

    return () => {
      removeWalletListener();
      pollingRef.current = 0;
    };
  }, []);

  const setLocalStorageSession = () => {
    const localSessionId = localStorage.getItem(SESSION_LOCAL_STORAGE_ID);

    if (localSessionId && localSessionId === zampSession.paymentInfo.id && ENV !== ENVTypes.LOCAL) {
      setCurrentPage(ZampfiPages.SESSION_EXPIRED);
    } else {
      localStorage.setItem(SESSION_LOCAL_STORAGE_ID, zampSession.paymentInfo.id);
      localStorage.removeItem(SESSION_ENDED_LOCAL_STORAGE_ID);
    }
  };

  const setSessionEndedLocalStorage = () => {
    localStorage.setItem(SESSION_ENDED_LOCAL_STORAGE_ID, `${zampSession.paymentInfo.id}`);
  };

  const isSessionEnded = () => {
    const isEnded = localStorage.getItem(SESSION_ENDED_LOCAL_STORAGE_ID);

    return isEnded === `${zampSession.paymentInfo.id}`;
  };

  const setAccountBalances = async () => {
    if (convertedAmounts?.length && address) {
      const tokenList = convertedAmounts.filter((item) => {
        return item.currency_code === TokenTypes.USDC || item.currency_code === TokenTypes.USDT;
      });

      let balances: Balance[] = [];

      if (isSolChain(selectedChainObject.network_chain_id))
        balances = await getSolBalancesArray(address, tokenList, selectedChainObject.network_chain_id);
      else
        balances = await getEthBalancesArray(
          address,
          tokenList,
          selectedChainObject.network_chain_id,
          selectedWallet.name
        );
      setBalances(balances);
    }
  };

  const getExchangeRate = async (skipRiskStatus = false) => {
    let requestCounter = 0;

    const getPaymentPoll = async () => {
      setIsExchangeRatesFetched(false);
      if (requestCounter === GET_PAYMENT_POLLING_COUNT) {
        clearInterval(pollingRef.current);
        pollingRef.current = 0;
        setModalOpen(ModalTypes.CANNOT_PROCESS);
      }

      const response = await paymentSession.getPaymentInstance();

      let isRiskSuccess = skipRiskStatus;

      if (!skipRiskStatus)
        if (response.risk_status !== RiskStatus.NOT_CONFIRMED)
          if (response.risk_status === RiskStatus.SUCCESS) {
            isRiskSuccess = true;
          } else {
            setModalOpen(ModalTypes.CANNOT_PROCESS);
            clearInterval(pollingRef.current);
            pollingRef.current = 0;
            setLoading(false);
          }

      if (isRiskSuccess && response.converted_amounts) {
        clearInterval(pollingRef.current);
        pollingRef.current = 0;

        setExchangeRatesExpiryTime(new Date(response.exchange_rates_expiry));
        setConvertedAmounts(response.converted_amounts);
      }

      requestCounter += 1;
    };

    // to prevent multiple polls being set
    // to handle case of switch + connect trigger
    if (!pollingRef.current) pollingRef.current = window.setInterval(getPaymentPoll, 1000);
  };

  const onPaymetCompleted = (paymentStatus = 'error') => {
    setSessionEndedLocalStorage();
    let paymentdetails = { status: '', message: '' };

    // TODO: remove unwanted code
    switch (paymentStatus) {
      case 'success':
        paymentdetails = {
          status: 'success',
          message: 'Payment completed successfully.'
        };
        break;
      case 'error':
        paymentdetails = {
          status: 'error',
          message: 'Payment failed.'
        };
        break;
      default:
        paymentdetails = {
          status: 'error',
          message: 'Payment failed.'
        };
        break;
    }

    onPaymentCompleted(paymentdetails);
  };

  const handlePaymentCancelOrFail = () => {
    setSessionEndedLocalStorage();
    onPaymentCancel();
  };

  const onTimerCompleted = () => {
    clearInterval(timerRef.current);
    onTimeOut();
  };

  const onTimeOut = () => {
    setModalOpen(ModalTypes.TIME_UP);
  };

  const onWalletConnected = async (connectionInfo: ConnectionInformation, paymentOption?: Wallets) => {
    setLoading(true);
    const resp = await paymentSession.updatePaymentInstance(connectionInfo);

    if (resp?.data) {
      // TODO: make function
      await getExchangeRate(paymentOption === Wallets.BINANCE || paymentOption === Wallets.BTC);
    } else if (resp?.error?.code === APIErrorCode.EXCHANGE_RATE_EXPIRED) {
      setLoading(false);
      onTimeOut();
    } else {
      setLoading(false);
      setCurrentPage(ZampfiPages.ERROR_SCREEN);
    }
  };

  const onWalletDisconnect = async () => {
    if (selectedWallet.name === Wallets.WALLETCONNECT) await disconnectWalletConnect();
    else if (selectedWallet.name === Wallets.PHANTOM) await disconnectPhantom();
    clearValues();
    setCurrentPage(ZampfiPages.WALLET_LIST);
  };

  const onTransactionCompleted = async (hash: string, paymentId: string) => {
    paymentSession.updateTransactionDetails(
      {
        transaction_hash: hash
      },
      paymentId
    );
    // TODO: check for hash in patch - if not found do payments get poll until we get hash.
  };

  const handleCreatePayment = async (payload: string) => {
    return await paymentSession.postPayment(payload);
  };

  const confirmPaymentPoll = async (paymentId: string) => {
    let requestCounter = 0;

    const getPaymentPoll = async () => {
      if (requestCounter === GET_PAYMENT_POLLING_COUNT) {
        clearInterval(pollingRef.current);
        pollingRef.current = 0;
        setModalOpen(ModalTypes.CANNOT_PROCESS);
      }

      const response = await paymentSession.getPayment(paymentId);

      if (response?.data.transaction_hash) {
        clearInterval(pollingRef.current);
        pollingRef.current = 0;
        setCurrentPage(ZampfiPages.SUCCESS_SCREEN);
      }

      requestCounter += 1;
    };

    // to prevent multiple polls being set
    // to handle case of switch + connect trigger
    if (!pollingRef.current) pollingRef.current = window.setInterval(getPaymentPoll, 5000);
  };

  const clearValues = () => {
    setAddress(null);
    setBalances([]);
    setConvertedAmounts([]);
  };

  const handleInvalidChainBackButtonClick = async () => {
    clearValues();
    setCurrentPage(ZampfiPages.WALLET_LIST);
    if (selectedWallet.name === Wallets.WALLETCONNECT) await disconnectWalletConnect();
    setModalOpen(null);
  };

  const handleGenericErrorButtonClick = async () => {
    clearValues();
    setModalOpen(null);
    setCurrentPage(ZampfiPages.WALLET_LIST);
  };

  const handleConfirmModalCancel = () => {
    setIsPaymentStarted(false);
    setModalOpen(null);
  };

  const handleNoBurnerWalletErrorClick = () => {
    setModalOpen(null);
    if (currentPage === ZampfiPages.BINANCE_SCREEN) {
      handleBackButtonClick();
    } else if (selectedChainObject.network_code === CurrencyTypes.BTC) {
      clearValues();
      setSelectedChainObject(getDefaultSelectedChain());
    }
  };

  const renderPages = () => {
    switch (currentPage) {
      case ZampfiPages.WALLET_LIST:
        return (
          <div
            className={`zamp-content-wrapper ${
              isMobileDevice() && paymentSession.platform === Platform.BROWSER && 'zamp-content-wrapper-mobile'
            }`}
          >
            <div className='zamp-title'>Network</div>
            <NetworkSelect
              onSelectItem={setSelectedChainObject}
              itemsList={zampSession.merchantConfig.available_networks}
              isDropDownActive={isDropDownActive}
              setDropDownActive={setDropDownActive}
              itemInitialValue={selectedChainObject}
              isBottomSheetOpen={isBottomSheetOpen}
              setBottomSheetOpen={setBottomSheetOpen}
            />
            {selectedChainObject.network_code === CurrencyTypes.BTC ? (
              <BitCoinScreen
                totalPrice={zampSession.paymentInfo.source_amount}
                currencyType={zampSession.paymentInfo.source_currency}
                BTCConnectionInfo={getBTCConnectionInfo(
                  zampSession.merchantConfig.available_networks,
                  zampSession.merchantConfig.payment_options
                )}
                getQRCode={paymentSession.getBtcQrCode}
                createPayment={handleCreatePayment}
                paymentPoll={confirmPaymentPoll}
                onWalletConnected={onWalletConnected}
                isLoading={isLoading}
                setModalOpen={setModalOpen}
                setCurrentPage={setCurrentPage}
                setLoading={setLoading}
                clearValues={clearValues}
                convertedAmounts={convertedAmounts}
                paymentTimeLimit={time || paymentTimeLimit}
                maxTimeLimit={paymentTimeLimit}
                startTimer={isExchangeRatesFetched}
              />
            ) : (
              <Fragment>
                <div className='zamp-title'>Wallet/Exchange</div>
                <WalletList
                  setSelectedWallet={setSelectedWallet}
                  setAddress={setAddress}
                  setCurrentChain={setCurrentChain}
                  selectedChainObject={selectedChainObject}
                  walletList={zampSession.merchantConfig.payment_options}
                  setRemoveWalletListener={setRemoveWalletListener}
                  onWalletConnected={onWalletConnected}
                  setModalOpen={setModalOpen}
                  rpcUrls={rpcUrls as Map<number, EthChains>}
                />
              </Fragment>
            )}
          </div>
        );

      case ZampfiPages.COIN_LIST:
        return (
          <Fragment>
            <div
              className={`zamp-content-wrapper ${
                isMobileDevice() && paymentSession.platform === Platform.BROWSER && 'zamp-content-wrapper-mobile'
              }`}
            >
              {selectedWallet.name === Wallets.BINANCE ? (
                <SessionInfo
                  paymentTimeRemaining={time || paymentTimeLimit}
                  maxTimeLimit={paymentTimeLimit}
                  startTimer={isExchangeRatesFetched}
                />
              ) : (
                <ConnectionInfo
                  selectedWallet={selectedWallet}
                  address={address || ''}
                  paymentTimeRemaining={time || paymentTimeLimit}
                  hasDisconnect={selectedWallet.name !== Wallets.METAMASK}
                  onDisconnect={onWalletDisconnect}
                  isPaymentStarted={isPaymentStarted}
                  maxTimeLimit={paymentTimeLimit}
                  startTimer={isExchangeRatesFetched}
                />
              )}
              <div className='zamp-title'>Select Coin</div>
              <CoinList
                handlePageChange={setCurrentPage}
                setSelectedCoinObject={setSelectedCoinObject}
                setSelectedAmount={setSelectedAmount}
                address={address}
                currentChain={currentChain}
                selectedChain={selectedChainObject.network_chain_id}
                isPaymentStarted={isPaymentStarted}
                setIsPaymentStarted={setIsPaymentStarted}
                onCoinSelect={handleCreatePayment}
                amount={zampSession.paymentInfo?.source_amount}
                sourceCurrency={zampSession.paymentInfo?.source_currency}
                convertedAmounts={convertedAmounts as CoinData[]}
                balances={balances}
                onTransactionCompleted={onTransactionCompleted}
                setModalOpen={setModalOpen}
                selectedWallet={selectedWallet}
                isBottomSheetOpen={isBottomSheetOpen}
                setBottomSheetOpen={setBottomSheetOpen}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </Fragment>
        );

      case ZampfiPages.BINANCE_SCREEN:
        return (
          <div className='zamp-content-wrapper'>
            <SessionInfo
              paymentTimeRemaining={time || paymentTimeLimit}
              maxTimeLimit={paymentTimeLimit}
              startTimer={isExchangeRatesFetched}
            />
            <BinanceScreen
              coinData={selectedCoinObject as CoinData}
              sourceCurrency={zampSession.paymentInfo?.source_currency}
              amount={zampSession.paymentInfo?.source_amount}
              createPayment={handleCreatePayment}
              setLoading={setLoading}
              setCurrentPage={setCurrentPage}
              setModalOpen={setModalOpen}
              setShowBinanceTutorial={setShowBinanceTutorial}
              paymentPoll={confirmPaymentPoll}
            />
          </div>
        );

      case ZampfiPages.SUCCESS_SCREEN:
        return (
          <div className='zamp-content-wrapper'>
            <SuccessScreen
              handlePaymentCompleted={onPaymetCompleted}
              account={address}
              orderId={zampSession.paymentInfo.reference_id}
            />
          </div>
        );

      case ZampfiPages.PENDING_SCREEN:
        return (
          <div className='zamp-content-wrapper'>
            <PendingScreen
              amount={zampSession.paymentInfo.source_amount}
              selectedCoinObject={selectedCoinObject as CoinData}
              selectedAmount={selectedAmount}
              handlePaymentCompleted={onPaymetCompleted}
            />
          </div>
        );

      case ZampfiPages.ERROR_SCREEN:
        return (
          <div className='zamp-content-wrapper'>
            <ErrorScreen onHandleButtonClick={setCurrentPage} />
          </div>
        );

      case ZampfiPages.SESSION_EXPIRED:
        return (
          <div className='zamp-content-wrapper'>
            <ExpiredScreen />
          </div>
        );

      default:
        return null;
    }
  };

  const renderModal = () => {
    switch (isModalOpen) {
      case ModalTypes.WALLET_CONNECT:
        return <WalletPopUp isConnected={false} selectedWallet={selectedWallet} />;
      case ModalTypes.WALLET_CONFIRM:
        return (
          <WalletPopUp
            isConnected={true}
            selectedWallet={selectedWallet}
            showCancel={selectedWallet.name === Wallets.WALLETCONNECT}
            onCancel={handleConfirmModalCancel}
          />
        );
      case ModalTypes.WALLET_INSTALL:
        return <InstallationPopUp selectedWallet={selectedWallet} handlePaymentCancel={handlePaymentCancelOrFail} />;
      case ModalTypes.TIME_UP:
        return <TimeUpModal handlePaymentCancel={handlePaymentCancelOrFail} />;
      case ModalTypes.INVALID_ACCOUNT:
        return (
          <ErrorModal
            errorType={ErrorType.PAYMENT_FAILED}
            buttonLabel={INVALID_ACCOUNT.buttonLabel}
            header={INVALID_ACCOUNT.header}
            description={INVALID_ACCOUNT.description}
            handleButtonClick={() => {
              setCurrentPage(ZampfiPages.WALLET_LIST);
              setModalOpen(null);
            }}
          />
        );
      case ModalTypes.CANNOT_PROCESS:
        return (
          <ErrorModal
            errorType={ErrorType.PAYMENT_FAILED}
            buttonLabel={CANNOT_PROCESS_ERROR_PROPS.buttonLabel}
            header={CANNOT_PROCESS_ERROR_PROPS.header}
            description={CANNOT_PROCESS_ERROR_PROPS.description}
            handleButtonClick={() => {
              setCurrentPage(ZampfiPages.WALLET_LIST);
              setModalOpen(null);
            }}
          />
        );
      case ModalTypes.GENERIC_ERROR:
        return (
          <ErrorModal
            errorType={ErrorType.GENERIC_ERROR}
            buttonLabel={GENERIC_ERROR_PROPS.buttonLabel}
            header={GENERIC_ERROR_PROPS.header}
            description={GENERIC_ERROR_PROPS.description}
            handleButtonClick={handleGenericErrorButtonClick}
          />
        );
      case ModalTypes.INVALID_CHAIN:
        return (
          <ErrorModal
            errorType={ErrorType.INVALID_CHAIN}
            buttonLabel={INVALID_CHAIN_PROPS.buttonLabel}
            header={INVALID_CHAIN_PROPS.header}
            description={INVALID_CHAIN_PROPS.description}
            handleButtonClick={handleInvalidChainBackButtonClick}
          />
        );
      case ModalTypes.METAMASK_PENDING_REQUEST:
        return (
          <ErrorModal
            errorType={ErrorType.METAMASK_PENDING_REQUEST}
            buttonLabel={METAMASK_PENDING_REQUEST_PROPS.buttonLabel}
            header={METAMASK_PENDING_REQUEST_PROPS.header}
            description={METAMASK_PENDING_REQUEST_PROPS.description}
            handleButtonClick={() => {
              setModalOpen(null);
            }}
          />
        );
      case ModalTypes.NO_BURNER_WALLET:
        return (
          <ErrorModal
            errorType={ErrorType.NO_BURNER_WALLET}
            buttonLabel={NO_BURNER_WALLET.buttonLabel}
            header={NO_BURNER_WALLET.header}
            description={NO_BURNER_WALLET.description}
            handleButtonClick={handleNoBurnerWalletErrorClick}
          />
        );
    }
  };

  const errorPage = () => <p>Oh no! We ran into an error</p>;

  const handleBackButtonClick = () => {
    if (currentPage === ZampfiPages.COIN_LIST) {
      clearValues();
      setCurrentPage(ZampfiPages.WALLET_LIST);
    } else if (currentPage === ZampfiPages.SESSION_EXPIRED || currentPage === ZampfiPages.ERROR_SCREEN) {
      handlePaymentCancelOrFail();
    } else if (currentPage === ZampfiPages.BINANCE_SCREEN) {
      setCurrentPage(ZampfiPages.COIN_LIST);
    } else {
      setBottomSheetOpen(BottomSheetTypes.GO_BACK);
    }
  };

  return (
    <div className='zamp-checkout-page' role='presentation' onClick={() => setDropDownActive(false)} ref={containerRef}>
      <Topbar onBackButtonClick={handleBackButtonClick} isDisabled={isPaymentStarted} />
      <div className='zamp-checkout-page-contents'>
        <div className='zamp-checkout-page-content-body'>
          {currentPage !== ZampfiPages.SUCCESS_SCREEN && currentPage !== ZampfiPages.SESSION_EXPIRED && (
            <Header
              sourceAmount={zampSession.paymentInfo?.source_amount}
              userDetails={zampSession.merchantConfig.merchant}
              orderId={zampSession.paymentInfo?.id}
              sourceCurrency={zampSession.paymentInfo?.source_currency}
            />
          )}
          {isError ? errorPage() : renderPages()}
        </div>
        <Footer />
      </div>
      <BottomSheet isOpen={isBottomSheetOpen === BottomSheetTypes.GO_BACK} setBottomSheetOpen={setBottomSheetOpen}>
        <GoBack
          title='Leaving? you won’t be able to continue this transaction'
          description=' upon confirmation, this transaction will be cancelled, and you’ll have to start a new payment'
          primaryButtonLabel='Yes, leave'
          onPrimaryButtonClick={handlePaymentCancelOrFail}
          secondaryButtonLabel='No'
          toggleSheetOpen={() => setBottomSheetOpen(null)}
        />
      </BottomSheet>
      {isLoading && <Loader />}
      {isModalOpen && (
        <Modal
          showCloseButton={isModalOpen === ModalTypes.WALLET_INSTALL}
          onCloseButtonClick={() => setModalOpen(null)}
        >
          {renderModal()}
        </Modal>
      )}
      {selectedWallet.name === Wallets.WALLETCONNECT &&
        isMobileDevice() &&
        getDeviceOS() === OS.ANDROID &&
        isPaymentStarted && (
          <CoachLabel
            logoUrl={getSelectedWalletIcon(selectedWallet) || ''}
            walletName={getSelectedWalletName(selectedWallet) || ''}
            onCancel={handleConfirmModalCancel}
          />
        )}
      {showBinanceTutorial && <Tutorial handleCloseButtonClick={() => setShowBinanceTutorial(false)} />}
    </div>
  );
};

export default Content;
