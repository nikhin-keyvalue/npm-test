import Preact, { h } from 'preact';

import Button from 'ui/components/button/Button';
import { ButtonType, ErrorType } from 'constants/common';
import { ErrorModalProps } from 'types';
import { ASSETS_PATH } from 'config';

import './style.scss';

const ErrorModal: Preact.FunctionComponent<ErrorModalProps> = ({
  errorType,
  buttonLabel,
  handleButtonClick,
  header,
  description
}) => (
  <div className='zamp-error-modal-content'>
    {errorType === ErrorType.PAYMENT_FAILED ? (
      <img
        className='zamp-error-modal-icon'
        src={`${ASSETS_PATH}/public/images/payment-failed-icon.svg`}
        alt='Payment Failed'
      />
    ) : (
      <img src={`${ASSETS_PATH}/public/images/transaction-failed-icon.svg`} alt='Transaction failed' />
    )}
    <div className='zamp-error-modal-header'>{header}</div>
    <div className='zamp-error-modal-description'>{description}</div>
    <Button type={ButtonType.SECONDARY} buttonLabel={buttonLabel} handleButtonClick={handleButtonClick} />
  </div>
);

ErrorModal.defaultProps = {
  errorType: ErrorType.GENERIC_ERROR
};

export default ErrorModal;
