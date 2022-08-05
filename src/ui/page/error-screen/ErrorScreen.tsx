import Preact, { h } from 'preact';

import { ErrorType, ZampfiPages } from 'constants/common';
import { ASSETS_PATH } from 'config';

import './style.scss';

interface ErrorScreenProps {
  onHandleButtonClick: (args: ZampfiPages) => void;
  errorType?: string;
}

const ErrorScreen: Preact.FunctionComponent<ErrorScreenProps> = ({
  onHandleButtonClick,
  errorType = ErrorType.TRANSACTION_FAILED
}) => (
  <div className='zamp-error-screen-wrapper'>
    {errorType === ErrorType.TRANSACTION_FAILED ? (
      <div className='error-icon-container'>
        <img src={`${ASSETS_PATH}/public/images/transaction-failed-icon.svg`} alt='transaction failed icon' />
        <div className='error-type-container'>Transaction Failed</div>
        <div className='error-message-container'>We are unable to allow this transaction at this point.</div>
      </div>
    ) : (
      <div className='error-icon-container'>
        <img src={`${ASSETS_PATH}/public/images/payment-failed-icon.svg`} alt='transaction failed icon' />
        <div className='error-type-container'>Payment Failed</div>
        <div className='error-message-container'>We are unable to proceed with this payment</div>
      </div>
    )}
    <button
      className='button-container'
      onClick={() => {
        onHandleButtonClick(ZampfiPages.WALLET_LIST);
      }}
    >
      CHOOSE ANOTHER WALLET
    </button>
  </div>
);

export default ErrorScreen;
