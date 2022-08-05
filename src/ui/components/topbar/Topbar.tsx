import Preact, { h } from 'preact';

import { ASSETS_PATH } from 'config';

import './style.scss';

interface TopbarProps {
  onBackButtonClick: () => void;
  isDisabled: boolean;
}

const Topbar: Preact.FunctionComponent<TopbarProps> = ({ onBackButtonClick, isDisabled }) => (
  <div className='zamp-topbar-wrapper'>
    <div className='zamp-topbar-go-back-wrapper'>
      <img
        src={`${ASSETS_PATH}/public/icons/back.svg`}
        alt='Back button'
        height='12'
        className={`zamp-topbar-back-icon ${isDisabled && 'zamp-toolbar-disabled-icon'}`}
        onClick={() => {
          if (!isDisabled) onBackButtonClick();
        }}
      />
    </div>
    <div className='zamp-topbar-title'>Recharge by crypto</div>
  </div>
);

export default Topbar;
