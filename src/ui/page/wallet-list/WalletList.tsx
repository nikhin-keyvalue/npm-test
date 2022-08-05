import Preact, { h } from 'preact';
import { useEffect } from 'preact/hooks';

import { getChainParams, getFallbackWalletIcon, getLocalStorageWalletConnect, parseChain } from 'ui/utils/common';
import { addChain, addMetaMaskWalletListener, connectMetaMask, switchChain } from 'ui/wallets/Metamask';
import { connectProvider, connectWalletConnect } from 'ui/wallets/WalletConnect';
import { connectPhantom } from 'ui/wallets/Phantom';
import { EthChains, MetamaskErrorCode } from 'constants/wallet';
import { ModalTypes, Wallets } from 'constants/common';
import { ConnectionInformation, WalletListProps } from 'types';
import { ASSETS_PATH } from 'config';
import { getDeviceOS } from 'zamp/payment/utils';
import { isEthChain } from 'ui/utils/wallet';
import { ConnectionResponse } from 'types/wallet';

import './style.scss';

const WalletList: Preact.FunctionComponent<WalletListProps> = ({
  setSelectedWallet,
  setAddress,
  setCurrentChain,
  selectedChainObject,
  walletList,
  setRemoveWalletListener,
  onWalletConnected,
  setModalOpen,
  rpcUrls
}) => {
  const disconnectHandler = () => {
    setAddress(null);
  };

  const accountChangeHandler = (accounts: string | any[]) => {
    setAddress(accounts.length > 0 ? (accounts[0] as string) : null);
  };

  const chainChangeHandler = (newChain: EthChains | number) => {
    setCurrentChain(parseChain(newChain));
  };

  const handleMetamaskConnect = async () => {
    const resp = await connectMetaMask();
    let isOnValidChain = true;

    if (resp)
      if (resp.address) {
        const selectedChain = selectedChainObject.network_chain_id;

        if (resp.chain !== selectedChain) {
          isOnValidChain = false;
          let addChainResp = true;
          let switchChainResp = true;

          if (selectedChain === EthChains.MUMBAI || selectedChain === EthChains.POLYGON)
            addChainResp = await addChain(getChainParams(selectedChain));
          switchChainResp = await switchChain(selectedChain);
          if (switchChainResp) {
            setCurrentChain(selectedChain);
            setAddress(resp.address);
          }
          isOnValidChain = addChainResp && switchChainResp;
        } else {
          setCurrentChain(resp.chain);
          setAddress(resp.address);
        }
        const removeWalletListener = addMetaMaskWalletListener(accountChangeHandler, chainChangeHandler);

        setRemoveWalletListener(removeWalletListener as () => void);
        setModalOpen(null);
      } else if (!resp.success) {
        if (resp.error === MetamaskErrorCode.EXISTING_REQUEST) setModalOpen(ModalTypes.METAMASK_PENDING_REQUEST);
        else setModalOpen(ModalTypes.GENERIC_ERROR);
      } else {
        setModalOpen(null);
      }
    else setModalOpen(ModalTypes.WALLET_INSTALL);

    return isOnValidChain ? resp : null;
  };

  const handlePhantomClick = async () => {
    const resp = await connectPhantom();

    if (resp)
      if (resp.address) {
        setAddress(resp.address);
        setModalOpen(null);

        return resp;
      } else if (!resp.success) {
        setModalOpen(ModalTypes.GENERIC_ERROR);
      } else {
        setModalOpen(null);
      }
    else setModalOpen(ModalTypes.WALLET_INSTALL);
  };

  const handleWalletConnectClick = async () => {
    // TODO: parse to EthChains
    const resp = await connectWalletConnect(
      selectedChainObject.network_chain_id as EthChains,
      getDeviceOS(),
      accountChangeHandler,
      chainChangeHandler,
      disconnectHandler,
      rpcUrls
    );

    if (resp.address)
      if (resp?.chain === selectedChainObject.network_chain_id) {
        if (resp.chain === selectedChainObject.network_chain_id) {
          setCurrentChain(resp.chain);
          setAddress(resp.address);
        }

        return resp;
      } else if (!resp.success) {
        // TODO: ignore or add error notifier
      } else {
        setModalOpen(ModalTypes.INVALID_CHAIN);
      }
  };

  const onWalletSelect = async (item: Wallets) => {
    setSelectedWallet(walletList[item]);

    let connectionResponse: ConnectionResponse;
    let data: ConnectionInformation;

    if (item !== Wallets.WALLETCONNECT && item !== Wallets.BINANCE) setModalOpen(ModalTypes.WALLET_CONNECT);

    switch (walletList[item].name) {
      case Wallets.METAMASK:
        connectionResponse = await handleMetamaskConnect();
        break;
      case Wallets.PHANTOM:
        connectionResponse = await handlePhantomClick();
        break;
      case Wallets.WALLETCONNECT:
        connectionResponse = await handleWalletConnectClick();
        break;
      case Wallets.BINANCE:
        data = {
          payment_option_id: walletList[item].id,
          network_code: selectedChainObject.network_code
        };
        onWalletConnected(data, walletList[item].name);
        break;
      default:
        return;
    }

    if (connectionResponse?.address) {
      data = {
        payment_option_id: walletList[item].id,
        source_account: connectionResponse.address,
        network_code: selectedChainObject.network_code
      };

      onWalletConnected(data);
    }
  };

  const handleWalletClick = async (item: Wallets) => {
    await onWalletSelect(item);
  };

  // To handle wallet side WC Disconnects, must initialize this method to clear local storage
  useEffect(() => {
    if (isEthChain(selectedChainObject.network_chain_id) && getLocalStorageWalletConnect() && rpcUrls)
      connectProvider(selectedChainObject.network_chain_id, rpcUrls);
  }, [rpcUrls]);

  return (
    <div>
      {/* TODO: tobe removed */}
      <div className='zamp-wallet-container' role='presentation' key='nikhin' onClick={() => null}>
        <div className='zamp-wallet-label-container'>
          <img src={`${ASSETS_PATH}/public/icons/generic-crypto.svg`} alt='' className='wallet-icons' />
          <div className='wallet-name'>Pay with Exchange</div>
        </div>
        <div className='arrow-container'>
          <img src={`${ASSETS_PATH}/public/icons/exchange-icons.svg`} alt='' height='15' style='margin-right: 10px;' />
          <img src={`${ASSETS_PATH}/public/images/right-arrow.svg`} alt='' height='11' />
        </div>
      </div>
      <div className='zamp-wallet-container' role='presentation' key='nik' onClick={() => null}>
        <div className='zamp-wallet-label-container'>
          <img src={`${ASSETS_PATH}/public/icons/pay-with-qr.svg`} alt='' className='wallet-icons' />
          <div className='wallet-name'>Pay with QR</div>
        </div>
        <div className='arrow-container'>
          <img src={`${ASSETS_PATH}/public/images/right-arrow.svg`} alt='' height='11' />
        </div>
      </div>
      {/* Till here */}

      {selectedChainObject?.eligible_payment_options?.map((item) => {
        return (
          <div className='zamp-wallet-container' role='presentation' key={item} onClick={() => handleWalletClick(item)}>
            <div className='zamp-wallet-label-container'>
              <img
                src={walletList[item]?.logo_url}
                alt='wallet-icon'
                className='wallet-icons'
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackWalletIcon(item);
                }}
              />
              <div className='wallet-name'>{walletList[item]?.name}</div>
            </div>
            <div className='arrow-container'>
              <img src={`${ASSETS_PATH}/public/images/right-arrow.svg`} alt='' height='11' />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WalletList;
