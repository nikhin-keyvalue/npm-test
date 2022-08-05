import Preact, { h } from 'preact';

import Button from 'ui/components/button/Button';
import Timer from 'ui/components/timer/Timer';
import { getSelectedWalletIcon, getSelectedWalletName, isWalletConnect, parseAddress } from 'ui/utils/common';
import { WalletData } from 'types';
import { ButtonType } from 'constants/common';
import { ASSETS_PATH } from 'config';

import './style.scss';

interface ConnectionInfoProps {
  selectedWallet: WalletData;
  address: string;
  paymentTimeRemaining: number;
  hasDisconnect?: boolean;
  onDisconnect?: () => Promise<void>;
  isPaymentStarted: boolean;
  maxTimeLimit: number;
  startTimer: boolean;
}

const ConnectionInfo: Preact.FunctionComponent<ConnectionInfoProps> = ({
  selectedWallet,
  address,
  paymentTimeRemaining,
  hasDisconnect,
  onDisconnect,
  isPaymentStarted,
  maxTimeLimit,
  startTimer
}) => (
  <div className='zamp-connection-info-wrapper'>
    <div className={`zamp-connection-info ${hasDisconnect && 'zamp-connection-disconnect-info'}`}>
      <div className='zamp-connection-info-wallet-items'>
        <div className='zamp-connection-info-wallet-data'>
          <img
            className='zamp-connection-info-connected-wallet-icon'
            src={getSelectedWalletIcon(selectedWallet)}
            alt='wallet'
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `${ASSETS_PATH}/public/images/wallet-connect-icon.svg`;
            }}
          />
          <div className={`zamp-connection-primary-info`}>
            <div className='zamp-connection-details'>
              <div className='zamp-connection-address'>
                {`${getSelectedWalletName(selectedWallet)} connected ${isWalletConnect(selectedWallet) ? '(WC)' : ''}`}
                <img
                  className='zamp-connection-status'
                  src={`${ASSETS_PATH}/public/images/connected-icon.svg`}
                  alt='wallet-icon'
                />
              </div>
              <div className='zamp-address-info'>{parseAddress(address)}</div>
            </div>
          </div>
        </div>
        {hasDisconnect && (
          <div className='zamp-connection-info-disconnect-container'>
            <Button
              buttonLabel='Disconnect'
              type={ButtonType.DISCONNECT}
              handleButtonClick={async () => {
                if (onDisconnect) await onDisconnect();
              }}
              isDisabled={isPaymentStarted}
            />
          </div>
        )}
      </div>
      <div className='zamp-connection-info-timer'>
        <Timer
          totalTimeDuration={maxTimeLimit}
          currentTime={paymentTimeRemaining}
          startTimer={startTimer}
          timerText={hasDisconnect ? 'Remaining' : ''}
        />
      </div>
    </div>
  </div>
);

ConnectionInfo.defaultProps = {
  hasDisconnect: true,
  onDisconnect: async () => {}
};

export default ConnectionInfo;
