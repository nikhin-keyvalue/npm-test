import Preact, { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { BottomSheetTypes } from 'constants/common';
import { isMobileDevice } from 'ui/utils/common';

import './style.scss';

type BottomSheetProps = {
  isOpen: boolean;
  children: any;
  setBottomSheetOpen: (state: BottomSheetTypes | null) => void;
};

const BottomSheet: Preact.FunctionComponent<BottomSheetProps> = ({ isOpen = false, children, setBottomSheetOpen }) => {
  const [isModalOpen, toggleModalOpen] = useState(false);
  const [isSheetOpen, toggleSheetOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      toggleModalOpen(isOpen);
      setTimeout(() => {
        toggleSheetOpen(isOpen);
      }, 50);
    } else {
      setTimeout(() => {
        toggleSheetOpen(isOpen);
      }, 50);

      setTimeout(() => {
        toggleModalOpen(isOpen);
      }, 250);
    }
  }, [isOpen]);

  return (
    <div
      className={`zamp-bottom-sheet-wrapper ${isModalOpen ? 'zamp-bottom-sheet-open' : ''}`}
      role='presentation'
      onClick={() => setBottomSheetOpen(null)}
    >
      <div
        className={`zamp-bottom-sheet-content ${isSheetOpen ? 'zamp-sheet-content-open' : 'zamp-sheet-content-close'} ${
          isMobileDevice() ? 'zamp-bottomsheet-mobile-padding' : ''
        }`}
        role='presentation'
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
