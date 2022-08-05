import Preact, { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { WalletPopUpProps } from 'types';
import { ASSETS_PATH } from 'config';
import { getSelectedWalletIcon, getSelectedWalletName } from 'ui/utils/common';

import './style.scss';

const WalletPopUp: Preact.FunctionComponent<WalletPopUpProps> = ({
  selectedWallet,
  isConnected,
  showCancel = false,
  onCancel,
  cancelDelay = 30000
}) => {
  const [isCancelDelayOver, setIsCancelDelayOver] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsCancelDelayOver(true);
    }, cancelDelay);
  }, []);

  return (
    <div className='zamp-metamask-modal-content'>
      <div className='zamp-modal-icon-header'>
        <img src={`${ASSETS_PATH}/public/images/zampconnect.svg`} alt='Zamp connect' width={36} height={36} />

        {isConnected ? (
          <img src={`${ASSETS_PATH}/public/images/walletconnected.svg`} alt='Wallet connected' />
        ) : (
          <div className='dot-flashing'></div>
        )}
        <img src={getSelectedWalletIcon(selectedWallet)} alt='wallet' width={42} height={42} />
      </div>
      <div className='zamp-modal-description'>
        {`Please click ${isConnected ? `Confirm` : `connect`} on 
      ${getSelectedWalletName(selectedWallet)} wallet popup to continue payment`}
      </div>
      <div className='zamp-modal-wallet-connect-indicator'>
        <img
          className='zamp-modal-indicatior-gif'
          src={`${ASSETS_PATH}/public/gif/wallet-${isConnected ? `confirm` : `connect`}.gif`}
          alt='Confirm indicator'
          width={169}
          height={99}
        />
      </div>
      {isConnected && showCancel && isCancelDelayOver && (
        <div className='zamp-cancel-container' role='presentation' onClick={onCancel}>
          Cancel Transaction
        </div>
      )}
    </div>
  );
};

export default WalletPopUp;
