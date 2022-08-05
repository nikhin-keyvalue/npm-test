import Preact, { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Button from 'ui/components/button/Button';
import { ButtonType, TIME_UP_REDIRECTION_TIME } from 'constants/common';
import { TimeUpModalProps } from 'types';
import { ASSETS_PATH } from 'config';

import './style.scss';

const TimeUpModal: Preact.FunctionComponent<TimeUpModalProps> = ({ handlePaymentCancel }) => {
  const [timeUpCount, setTimeUpCount] = useState(TIME_UP_REDIRECTION_TIME);

  useEffect(() => {
    if (timeUpCount < 1) handlePaymentCancel();
    setTimeout(() => {
      if (timeUpCount) setTimeUpCount(timeUpCount - 1);
    }, 1000);
  }, [timeUpCount]);

  return (
    <div className='zamp-time-up-modal-content'>
      <img src={`${ASSETS_PATH}/public/images/timeup-icon.svg`} alt='MetaMask icon' width={68} height={68} />
      <div className='zamp-time-up-modal-header'>TIme is up!</div>
      <div className='zamp-time-up-modal-description'>
        You will be redirected to the Merchant in
        <span className='zamp-time-up-modal-redirection-time'> {`${timeUpCount} secs`}</span>
      </div>
      <Button
        type={ButtonType.SECONDARY}
        buttonLabel='close'
        width={'104px'}
        height={'40px'}
        handleButtonClick={handlePaymentCancel}
      />
    </div>
  );
};

export default TimeUpModal;
