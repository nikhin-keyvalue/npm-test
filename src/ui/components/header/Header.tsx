import Preact, { h } from 'preact';

import './style.scss';

interface HeaderProps {
  sourceAmount: string;
  sourceCurrency: string;
  userDetails: any;
  orderId?: string;
}

const Header: Preact.FunctionComponent<HeaderProps> = ({ sourceAmount, sourceCurrency, userDetails }) => {
  const amount = String(sourceAmount).split('.');

  return (
    <div className='zamp-header-wrapper'>
      <div className='zamp-header-title'>
        <img src={userDetails?.logo} height='30' alt='Merchant logo' />
      </div>
      <div className='zamp-amount-container'>
        <div className='zamp-amount'>
          {sourceCurrency} {amount[0]}
          {amount[1] ? (
            <span className='zamp-amount-decimal-value'>.{amount[1]}</span>
          ) : (
            <span className='zamp-amount-decimal-value'>.00</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
