import Preact, { h } from 'preact';

import Timer from 'ui/components/timer/Timer';
import { ASSETS_PATH } from 'config';
import { DEFAULT_PAYMENT_TIME_LIMIT, DEFAULT_PAYMENT_TIME_REMAINING } from 'constants/common';

import './styles.scss';

interface SessionInfoProps {
  paymentTimeRemaining?: number;
  maxTimeLimit?: number;
  startTimer: boolean;
}

const SessionInfo: Preact.FunctionComponent<SessionInfoProps> = ({
  paymentTimeRemaining = DEFAULT_PAYMENT_TIME_REMAINING,
  maxTimeLimit = DEFAULT_PAYMENT_TIME_LIMIT,
  startTimer
}) => (
  <div className='zamp-payment-info-container'>
    <div className='zamp-payment-info-option-details'>
      {/* TODO: make configurable*/}
      <img src={`${ASSETS_PATH}/public/images/binance-icon.svg`} alt='logo' />
      <div className='zamp-payment-info-option-name'>Binance</div>
    </div>
    <div>
      <Timer
        totalTimeDuration={maxTimeLimit}
        currentTime={paymentTimeRemaining}
        startTimer={startTimer}
        timerText={'Remaining'}
        styleOffset={true}
      />
    </div>
  </div>
);

export default SessionInfo;
