import Preact, { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { PaymentStatus, FULL_DASH_ARRAY } from 'constants/common';

import './style.scss';

interface SuccessTimerProps {
  //duration in seconds
  timeDuration?: number;
  handlePaymentCompleted: (status) => void;
}

const SuccessTimer: Preact.FunctionComponent<SuccessTimerProps> = ({ timeDuration = 30, handlePaymentCompleted }) => {
  const [time, setTime] = useState<number>(timeDuration);
  const [circle, setCircle] = useState<string>(`${FULL_DASH_ARRAY}`);

  let timePassed = 0;
  let timeLeft = timeDuration;
  let timerInterval: ReturnType<typeof setInterval>;

  useEffect(() => {
    startTimer();
  }, []);

  const onTimesUp = () => {
    clearInterval(timerInterval);
    handlePaymentCompleted(PaymentStatus.SUCCESS);
  };

  const startTimer = () => {
    timerInterval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = timeDuration - timePassed;
      setTime(timeLeft);
      setCircleDasharray();
      if (timeLeft === 0) onTimesUp();
    }, 1000);
  };

  const formatTime = (time: number) => {
    let seconds: number | string = time % 60;

    if (seconds < 10) seconds = `0${seconds}`;

    return `${seconds}`;
  };

  const calculateTimeFraction = () => {
    const rawTimeFraction = timeLeft / timeDuration;

    return rawTimeFraction - (1 / timeDuration) * (1 - rawTimeFraction);
  };

  const setCircleDasharray = () => {
    const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;

    setCircle(circleDasharray);
  };

  return (
    <div className='base-timer'>
      <svg className='base-timer__svg' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
        <g className='base-timer__circle'>
          <path
            id='base-timer-path-remaining'
            strokeDasharray='283'
            className={`base-timer__path-remaining`}
            // eslint-disable-next-line react/no-unknown-property
            stroke-dasharray={circle}
            d='
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        '
          />
        </g>
      </svg>
      <span id='base-timer-label' className='base-timer__label'>
        {formatTime(time)}
      </span>
    </div>
  );
};

export default SuccessTimer;
