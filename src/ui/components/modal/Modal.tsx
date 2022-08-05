import Preact, { h } from 'preact';

import { ASSETS_PATH } from 'config';

import './style.scss';

type ModalProps = {
  children?: any;
  onClickOutside?: () => void;
  // TODO: write type so that function is only mandatory if showCloseButton is true
  showCloseButton?: boolean;
  onCloseButtonClick?: () => void;
};

const Modal: Preact.FunctionComponent<ModalProps> = ({
  children,
  onClickOutside,
  showCloseButton = false,
  onCloseButtonClick
}) => (
  <div className='zamp-modal-wrapper' role='presentation' onClick={onClickOutside}>
    <div
      className='zamp-modal-content'
      role='presentation'
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {showCloseButton && (
        <img
          onClick={onCloseButtonClick}
          className='zamp-modal-close-icon'
          src={`${ASSETS_PATH}/public/images/close-button.svg`}
          alt='close'
        />
      )}
      {children}
    </div>
  </div>
);

export default Modal;
