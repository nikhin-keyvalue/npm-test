import Preact, { h } from 'preact';
import { PaymentDetailsProps } from 'types';

import './styles.scss';

const PaymentDetails: Preact.FunctionComponent<PaymentDetailsProps> = ({
  isVisible,
  totalPrice,
  exchangeRate,
  subTotal,
  sourceCurrency,
  currencyCode
}) => (
  <div
    className={`zamp-payment-details-wrapper ${
      isVisible ? 'zamp-payment-details-visible' : 'zamp-payment-details-hidden'
    }`}
  >
    <div className='zamp-payment-details-price-container'>
      <div className='total-price-header'>Total Price</div>
      <div className='total-price'>{`${totalPrice} ${sourceCurrency}`}</div>
    </div>
    <div className='zamp-payment-details-exchange-rate-container'>
      <div className='exchange-rate-header'>Exchange Rate</div>
      <div className='exchange-rate'>{`${exchangeRate} ${sourceCurrency}`}</div>
    </div>
    <hr></hr>
    <div className='zamp-payment-details-subtotal-container'>
      <div className='subtotal-header'>Subtotal</div>
      <div className='subtotal'>{`${subTotal} ${currencyCode}`}</div>
    </div>
  </div>
);

PaymentDetails.defaultProps = {
  isVisible: true
};

export default PaymentDetails;
