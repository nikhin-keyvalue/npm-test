import Preact, { h } from 'preact';

import { ButtonType } from 'constants/common';
import { BottomSheetPaymentDetailsProps } from 'types';
import Button from 'ui/components/button/Button';

import './style.scss';

const PaymentDetails: Preact.FunctionComponent<BottomSheetPaymentDetailsProps> = ({
  totalPrice,
  subTotal,
  sourceCurrency,
  currencyCode,
  coinName,
  coinLogourl,
  exchangeRate,
  handlePayButtonClick,
  isPayButtonDisabled
}) => (
  <div className='zamp-payment-details-bottomsheet-wrapper'>
    <div className='zamp-payment-details-bottomsheet-head'>
      <div className='zamp-payment-details-bottomsheet-head-total-header'>Total Amount</div>
      <div className='zamp-payment-details-bottomsheet-head-total'>
        {subTotal} {currencyCode}
      </div>
      <div className='zamp-payment-details-bottomsheet-head-coin-details'>
        <img src={coinLogourl} alt='Coin-logo' width={8} height={8} />

        <div className='zamp-payment-details-bottomsheet-head-coin-name'>{coinName}</div>
      </div>
    </div>
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
    <div className='zamp-payment-details-bottomsheet-button-container'>
      <Button
        buttonLabel='Pay now'
        type={ButtonType.SECONDARY}
        handleButtonClick={handlePayButtonClick}
        width={'100px'}
        isDisabled={isPayButtonDisabled}
      />
    </div>
  </div>
);

export default PaymentDetails;
