import Preact, { h } from 'preact';

import { ButtonType } from 'constants/common';
import Button from 'ui/components/button/Button';

import './style.scss';

type goBackBottomSheetProps = {
  onPrimaryButtonClick: () => void;
  title: string;
  description: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  toggleSheetOpen: (state: boolean) => void;
};

const GoBack: Preact.FunctionComponent<goBackBottomSheetProps> = ({
  onPrimaryButtonClick,
  title,
  description,
  primaryButtonLabel,
  secondaryButtonLabel,
  toggleSheetOpen
}) => {
  return (
    <div>
      <div className='zamp-bottom-sheet-title'>{title}</div>
      <div className='zamp-bottom-sheet-desc'>{description}</div>
      <div className='zamp-bottom-sheet-button-container'>
        <Button type={ButtonType.PRIMARY} buttonLabel={primaryButtonLabel} handleButtonClick={onPrimaryButtonClick} />
        <Button
          type={ButtonType.SECONDARY}
          buttonLabel={secondaryButtonLabel}
          handleButtonClick={() => toggleSheetOpen(false)}
        />
      </div>
    </div>
  );
};

export default GoBack;
