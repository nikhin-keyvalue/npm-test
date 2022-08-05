import Preact, { h } from 'preact';

import CircleCountDown from '../sektor';
import { DEFAULT_PAYMENT_TIME_LIMIT, DEFAULT_PAYMENT_TIME_REMAINING } from 'constants/common';

import './style.scss';

interface TimerProps {
  //duration in millisceonds
  totalTimeDuration?: number;
  currentTime?: number;
  timerText?: string;
  startTimer: boolean;
  //prop used to adjust style issue in certain components
  styleOffset?: boolean;
}
const Timer: Preact.FunctionComponent<TimerProps> = ({
  totalTimeDuration = DEFAULT_PAYMENT_TIME_LIMIT,
  currentTime = DEFAULT_PAYMENT_TIME_REMAINING,
  timerText,
  startTimer,
  styleOffset = false
}) => {
  const formatTime = (time: number) => {
    const minutes: number = Math.floor(time / 60);
    let seconds: number | string = time % 60;

    if (seconds < 10) seconds = `0${seconds}`;

    return `${minutes}:${seconds}`;
  };

  return (
    <div className='zamp-timer-wrapper'>
      <div className='zamp-border-circle'>
        <div className={`zamp-sektor-wrapper ${styleOffset && 'zamp-sektor-offset'}`}>
          <CircleCountDown time={totalTimeDuration} currentTime={currentTime} startTimer={startTimer} />
        </div>
      </div>
      <div className='zamp-time-wrapper'>{`${formatTime(currentTime)} ${timerText}`}</div>
    </div>
  );
};

Timer.defaultProps = {
  timerText: ''
};

export default Timer;
