import Preact, { h } from 'preact';
import { useState } from 'preact/hooks';

import PaymentDetails from 'ui/components/payment-details/PaymentDetails';
import Button from 'ui/components/button/Button';
import PaymentDetailsBottomSheet from 'ui/components/bottom-sheet/payment-details/paymentdetails';
import BottomSheet from 'ui/components/bottom-sheet/BottomSheet';
import { getCurrentPhantomAccount, sendSol, transferSolToken } from 'ui/wallets/Phantom';
import { getWalletConnectAccount, transferTokenWalletConnect, WalletConnectSendEth } from 'ui/wallets/WalletConnect';
import { isIOS, isMobileDevice } from 'ui/utils/common';
import { getMetamaskAccount, sendEth, transferToken } from 'ui/wallets/Metamask';
import { BottomSheetTypes, ButtonType, ModalTypes, Wallets, ZampfiPages } from 'constants/common';
import { CoinTypes, TransferOrSendResponse, SolTransferOrSendResponse } from 'types/wallet';
import { CoinData, CoinListProps, PostPaymentInfo } from 'types';
import { isEthereumBasedCoin, isSolBasedCoin, isSolChain, isToken } from 'ui/utils/wallet';
import { getDeviceOS } from 'zamp/payment/utils';
import { ASSETS_PATH } from 'config';

import './style.scss';

const CoinList: Preact.FunctionComponent<CoinListProps> = ({
  handlePageChange,
  setSelectedCoinObject,
  setSelectedAmount,
  onTransactionCompleted,
  selectedChain,
  address,
  convertedAmounts,
  amount,
  sourceCurrency,
  isPaymentStarted,
  setIsPaymentStarted,
  onCoinSelect,
  balances,
  setModalOpen,
  selectedWallet,
  isBottomSheetOpen,
  setBottomSheetOpen,
  setCurrentPage
}) => {
  const [showPaymentDetails, setShowPaymentDetails] = useState<string>();

  const handleInvalidAccount = () => {
    setModalOpen(ModalTypes.INVALID_ACCOUNT);
    setIsPaymentStarted(false);
  };

  const onPayButtonClick = async (item: CoinData) => {
    setBottomSheetOpen(null);
    setSelectedCoinObject(item);
    setSelectedAmount(item.amount);
    if (selectedWallet.name === Wallets.BINANCE) {
      setCurrentPage(ZampfiPages.BINANCE_SCREEN);
    } else {
      setIsPaymentStarted(true);
      const res = await onCoinSelect(item.currency_code);

      if (res?.data) {
        await sendTransaction(res.data, item);
      } else {
        setIsPaymentStarted(false);
        setCurrentPage(ZampfiPages.ERROR_SCREEN);
      }
    }
  };

  const sendTransaction = async (paymentDetails: PostPaymentInfo, coinInfo: CoinData) => {
    const { dest_account: toAddress, id: paymentId, amount, lowest_denom_amount, currency_code: coin } = paymentDetails;

    let response: TransferOrSendResponse = {
      success: false,
      transactionResponse: null
    };

    let solResponse: SolTransferOrSendResponse = {
      success: false,
      transactionResponse: null
    };

    switch (selectedWallet.name) {
      case Wallets.METAMASK:
        setModalOpen(ModalTypes.WALLET_CONFIRM);
        if ((await getMetamaskAccount()) !== address) {
          handleInvalidAccount();

          return;
        }
        if (isEthereumBasedCoin(coin)) response = await sendEth(address as string, toAddress, amount);
        else if (isToken(coin))
          response = await transferToken(toAddress, lowest_denom_amount, coin, coinInfo.contract_address);

        if (response?.transactionResponse) {
          await onTransactionCompleted(response.transactionResponse?.hash, paymentId);

          handlePageChange(ZampfiPages.SUCCESS_SCREEN);
        } else if (!response.success) {
          handlePageChange(ZampfiPages.ERROR_SCREEN);
        }
        break;

      case Wallets.WALLETCONNECT:
        if (!isMobileDevice() || isIOS(getDeviceOS())) setModalOpen(ModalTypes.WALLET_CONFIRM);
        if (getWalletConnectAccount() !== address) {
          handleInvalidAccount();

          return;
        }
        if (isEthereumBasedCoin(coin)) response = await WalletConnectSendEth(toAddress, amount);
        else if (isToken(coin))
          response = await transferTokenWalletConnect(toAddress, lowest_denom_amount, coin, coinInfo.contract_address);

        if (response?.transactionResponse) {
          await onTransactionCompleted(response.transactionResponse?.hash, paymentId);

          handlePageChange(ZampfiPages.SUCCESS_SCREEN);
        } else if (!response.success) {
          // TODO: walletConnect rejection must be handled as a notifier
        }
        break;
      case Wallets.PHANTOM:
        // TODO: might change when implementing mobile flow
        setModalOpen(ModalTypes.WALLET_CONFIRM);
        if (getCurrentPhantomAccount() !== address) {
          handleInvalidAccount();

          return;
        }
        if (isSolChain(selectedChain))
          if (isSolBasedCoin(coin))
            solResponse = await sendSol(address as string, toAddress, lowest_denom_amount, selectedChain);
          else if (isToken(coin))
            solResponse = await transferSolToken(
              toAddress,
              lowest_denom_amount,
              selectedChain,
              coinInfo.contract_address
            );

        if (solResponse.transactionResponse) {
          await onTransactionCompleted(solResponse.transactionResponse, paymentId);

          handlePageChange(ZampfiPages.SUCCESS_SCREEN);
        } else if (!solResponse.success) {
          handlePageChange(ZampfiPages.ERROR_SCREEN);
        }
    }

    setIsPaymentStarted(false);
    setModalOpen(null);
  };

  const handlePaymentDetailsClick = (coinId: string) => {
    if (isMobileDevice()) setBottomSheetOpen(BottomSheetTypes.PAYMENT_DETAILS);
    if (coinId === showPaymentDetails) setShowPaymentDetails('');
    else setShowPaymentDetails(coinId);
  };

  const hasBalance = (coin: CoinTypes, amount: string) =>
    Boolean((balances.find((balanceItem) => balanceItem.coin === coin)?.balance || 0) >= Number(amount));

  return (
    <div className='zamp-coin-container'>
      {convertedAmounts.map((item) => (
        <div className='zamp-coin-wrapper' key={item.currency_code}>
          <div className='zamp-coin-info'>
            <div className='zamp-coin-item'>
              <div className='zamp-coin-details'>
                <div>
                  <img src={item?.logo_url} alt='Coin' height='20' />
                </div>
                <div>
                  <div className='zamp-coin-name'>{item.display_name}</div>
                  <div
                    className='zamp-coin-value'
                    role='presentation'
                    onClick={() => handlePaymentDetailsClick(item.currency_code)}
                  >
                    {`${Number(item.amount).toFixed(10)} ${item.currency_code}`}
                    <img
                      src={`${ASSETS_PATH}/public/images/right-arrow.svg`}
                      alt='Arrow icon'
                      className='zamp-coin-arrow-icon'
                      style={{
                        transform:
                          showPaymentDetails === item.currency_code && !isMobileDevice()
                            ? 'rotate(270deg)'
                            : 'rotate(90deg)'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`zamp-coin-list-button-container ${
                  selectedWallet.name !== Wallets.BINANCE &&
                  !hasBalance(item.currency_code, item.amount) &&
                  'zamp-coin-list-insufficient-fund-indicator-button'
                }`}
                role='presentation'
              >
                <Button
                  type={ButtonType.SECONDARY}
                  buttonLabel='Pay now'
                  width='73px'
                  height='32px'
                  handleButtonClick={() => onPayButtonClick(item)}
                  //TODO: make function
                  isDisabled={
                    selectedWallet.name !== Wallets.BINANCE &&
                    (isPaymentStarted || !hasBalance(item.currency_code, item.amount))
                  }
                />
                <div className='zamp-insufficient-fund-indicator-container'>Low Balance</div>
              </div>
            </div>
            <PaymentDetails
              isVisible={showPaymentDetails === item?.currency_code && !isMobileDevice()}
              totalPrice={amount}
              exchangeRate={item.exchange_rate}
              subTotal={item.amount}
              sourceCurrency={sourceCurrency}
              currencyCode={item.currency_code}
            />
            <BottomSheet
              isOpen={Boolean(isBottomSheetOpen) && showPaymentDetails === item?.currency_code}
              setBottomSheetOpen={setBottomSheetOpen}
            >
              <PaymentDetailsBottomSheet
                totalPrice={amount}
                subTotal={item.amount}
                sourceCurrency={sourceCurrency}
                currencyCode={item.currency_code}
                coinName={item.display_name}
                exchangeRate={item.exchange_rate}
                coinLogourl={item.logo_url}
                handlePayButtonClick={() => onPayButtonClick(item)}
                isPayButtonDisabled={
                  selectedWallet.name !== Wallets.BINANCE &&
                  (isPaymentStarted || !hasBalance(item.currency_code, item.amount))
                }
              />
            </BottomSheet>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoinList;
