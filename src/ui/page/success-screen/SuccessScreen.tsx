import Preact, { h } from 'preact';

import Button from 'ui/components/button/Button';
import SuccessTimer from 'ui/components/success-timer/SuccessTimer';
import { ButtonType, PaymentStatus } from 'constants/common';
import { parseAddress } from 'ui/utils/common';
import { ASSETS_PATH } from 'config';

import './style.scss';

type SuccessScreenType = {
  handlePaymentCompleted: (status: string) => void;
  orderId: string;
  account?: string | null;
  successPageDisplayTime?: number;
};

const SuccessScreen: Preact.FunctionComponent<SuccessScreenType> = ({
  handlePaymentCompleted,
  successPageDisplayTime,
  account,
  orderId
}) => (
  <div className='success-screen-container'>
    <img src={`${ASSETS_PATH}/public/icons/pending-icon.svg`} className='success-screen-logo' alt='Pending Icon' />
    <div className='success-screen-status-wrapper'>
      <div className='success-screen-message-wrapper'>
        <div className='success-screen-title'>Payment Processing</div>
        <div className='success-screen-details'>You will be redirected to Merchant site soon</div>
      </div>
      <div className='success-screen-order-wrapper'>
        {account && (
          <div className='success-screen-order-details'>
            <div className='success-screen-order-title'>Account</div>
            <div className='success-screen-order-data-'>{parseAddress(account)}</div>
          </div>
        )}
        <div className='success-screen-order-details'>
          <div className='success-screen-order-title'>Order ID</div>
          <div className='success-screen-order-data'>{orderId}</div>
        </div>
      </div>
    </div>
    <div className='success-screen-button-container'>
      <Button
        buttonLabel='Done'
        type={ButtonType.SECONDARY}
        width={'100px'}
        handleButtonClick={() => handlePaymentCompleted(PaymentStatus.SUCCESS)}
      />
    </div>
    <div className='success-screen-redirection-container'>
      <SuccessTimer
        timeDuration={successPageDisplayTime}
        handlePaymentCompleted={() => handlePaymentCompleted(PaymentStatus.SUCCESS)}
      />
      <div className='success-screen-redirection-label'>Redirecting to Probo</div>
    </div>
  </div>
);

SuccessScreen.defaultProps = {
  successPageDisplayTime: 10
};

export default SuccessScreen;
