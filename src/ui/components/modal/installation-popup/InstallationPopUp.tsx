import Preact, { h } from 'preact';

import { InstallationPopUpProps } from 'types';
import { ButtonType } from 'constants/common';
import Button from 'ui/components/button/Button';
import { getWalletName, handleWalletInstallRedirect } from 'ui/utils/common';
import { ASSETS_PATH } from 'config';

import './style.scss';

const InstallationPopUp: Preact.FunctionComponent<InstallationPopUpProps> = ({
  selectedWallet,
  handlePaymentCancel
}) => (
  <div className='zamp-wallet-installation-modal-content'>
    <img
      //TODO image to be fetched from BE
      src={`${ASSETS_PATH}/public/images/${getWalletName(selectedWallet.name)}-icon.svg`}
      alt='wallet-icon'
      width={68}
      height={68}
    />
    <div className='zamp-wallet-installation-modal-header'>You need to install {selectedWallet.name}</div>
    <div className='zamp-wallet-installation-modal-description'>
      {selectedWallet.name} is a wallet and extension that allows you to make crypto transactions. In order to register
      your assest on the blockchain, you need to have it installed.
    </div>
    <Button
      type={ButtonType.SECONDARY}
      buttonLabel={`install ${selectedWallet.name}`}
      //TODO to be updated
      handleButtonClick={() => {
        handleWalletInstallRedirect(selectedWallet.name);
        handlePaymentCancel();
      }}
    />
  </div>
);

export default InstallationPopUp;
