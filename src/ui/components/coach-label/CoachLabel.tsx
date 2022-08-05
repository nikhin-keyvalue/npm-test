import Preact, { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Button from 'ui/components/button/Button';
import { ASSETS_PATH } from 'config';
import { ButtonType } from 'constants/common';
import { triggerAndroidWalletDeepLink } from 'ui/utils/common';

import './styles.scss';

type CoachLabelProps = {
  logoUrl: string;
  walletName: string;
  onCancel: () => void;
  cancelDelay?: number;
};

const CoachLabel: Preact.FunctionComponent<CoachLabelProps> = ({
  logoUrl,
  walletName,
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
    <div className='zamp-coach-label-wrapper'>
      <div className='zamp-coach-label-container'>
        <div className='zamp-coach-label'>
          <div className='zamp-coach-label-elements'>
            <div className='zamp-coach-label-logo'>
              <img
                src={logoUrl}
                alt='wallet-logo'
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `${ASSETS_PATH}/public/images/wallet-connect-icon.svg`;
                }}
              />
              <div className='zamp-coach-label-click'>
                <img src={`${ASSETS_PATH}/public/images/coach-click-hand.svg`} alt='coach-click' />
              </div>
            </div>
            <div className='zamp-coach-label-text'>{`Select ${walletName.toLowerCase()} to make the payment.`}</div>
          </div>
        </div>
        {isCancelDelayOver && (
          <div className='zamp-cancel-container' role='presentation' onClick={onCancel}>
            Cancel Transaction
          </div>
        )}
      </div>
      <div className='zamp-coach-label-redirect-container'>
        <Button
          type={ButtonType.SECONDARY}
          buttonLabel='Open Wallet'
          handleButtonClick={triggerAndroidWalletDeepLink}
        />
      </div>
    </div>
  );
};

export default CoachLabel;
