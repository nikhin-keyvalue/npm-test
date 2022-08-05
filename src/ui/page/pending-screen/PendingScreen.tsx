import Preact, { h } from 'preact';

import { CoinData } from 'types';
import { ASSETS_PATH } from 'config';

import './style.scss';

type PendingScreenType = {
  amount: string;
  handlePaymentCompleted: (status: string) => void;
  selectedCoinObject: CoinData;
  selectedAmount: string;
  successPageDisplayTime?: number;
};

const PendingScreen: Preact.FunctionComponent<PendingScreenType> = () => (
  <div className='pending-screen-container'>
    <img src={`${ASSETS_PATH}/public/icons/pending-icon.svg`} style='width:60%' alt='Pending Icon' />
    <div className='pending-status-wrapper'>
      <div className='pending-message-wrapper'>
        <div className='pending-title'>Payment Processing</div>
        <div className='pending-details'>You will be redirected to Merchant site soon</div>
      </div>
      <div className='pending-order-details'>
        <div className='pending-order-id-title'>Order ID</div>
        <div className='pending-order-id-'>ZAJ453129913iL4</div>
      </div>
    </div>
  </div>
);

PendingScreen.defaultProps = {
  successPageDisplayTime: 1000
};

export default PendingScreen;
