import Preact, { h } from 'preact';
import { useEffect } from 'preact/hooks';

import { Sektor } from './SektorLoader';
import { CIRCLE_COLOR, SECTOR_COLOR } from './constants';
import { DEFAULT_PAYMENT_TIME_LIMIT, DEFAULT_PAYMENT_TIME_REMAINING } from 'constants/common';

interface CircleCountDownProps {
  time?: number;
  currentTime?: number;
  startTimer: boolean;
}

const CircleCountDown: Preact.FunctionComponent<CircleCountDownProps> = ({
  time = DEFAULT_PAYMENT_TIME_LIMIT,
  currentTime = DEFAULT_PAYMENT_TIME_REMAINING,
  startTimer
}) => {
  useEffect(() => {
    if (startTimer) {
      const sektor1 = new Sektor('.sektor', {
        angle: ((time - currentTime) / 360) * 100,
        sectorColor: SECTOR_COLOR,
        circleColor: CIRCLE_COLOR
      });

      sektor1.animateTo(parseInt('360', 10), time * 1000);
    }
  }, [startTimer]);

  return <div className='sektor'></div>;
};

export default CircleCountDown;
