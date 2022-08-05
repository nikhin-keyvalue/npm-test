import Preact, { h } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';

import { AvailableNetworks, DropDownProps } from 'types';
import { ASSETS_PATH } from 'config';
import { isMobileDevice } from 'ui/utils/common';
import { BottomSheetTypes } from 'constants/common';
import NetworkSelectBottomSheet from 'ui/components/bottom-sheet/network-select/networkselect';
import BottomSheet from 'ui/components/bottom-sheet/BottomSheet';
import { useOnOutsideClick } from 'ui/utils/hooks';

import './styles.scss';

const NetworkSelect: Preact.FunctionComponent<DropDownProps> = ({
  onSelectItem,
  itemsList,
  isDropDownActive,
  setDropDownActive,
  itemInitialValue,
  isBottomSheetOpen,
  setBottomSheetOpen
}) => {
  const [selectedItem, setSelectedItem] = useState(itemInitialValue || itemsList[0]);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (item: AvailableNetworks) => {
    setDropDownActive(!isDropDownActive);
    setSelectedItem(item);
    onSelectItem(item);
  };

  const handleNetworkSelect = () => {
    setBottomSheetOpen(BottomSheetTypes.NETWORK_SELECT);
  };

  const getFilteredList = () =>
    itemsList.filter(
      (item) =>
        (isDropDownActive || item.network_code === selectedItem.network_code) && item.eligible_payment_options?.length
    );

  // TODO: remove once BTC/Burner wallet flow is changed in future.
  // This is to handle no burner case in BTC flow, switching to default network state
  useEffect(() => {
    setSelectedItem(itemInitialValue || itemsList[0]);
  }, [itemInitialValue]);

  useOnOutsideClick(dropDownRef, () => {
    if (isDropDownActive) setDropDownActive(false);
  });

  return isMobileDevice() ? (
    <div>
      <div className='zamp-dropdown-wrapper'>
        <div className='zamp-dropdown-list' role='presentation' onClick={handleNetworkSelect}>
          <div className='zamp-dropdown-item zamp-dropdown-item-selected'>
            <div className='zamp-dropdown-text-elements'>
              <img className='zamp-dropdown-item-icon' src={selectedItem.network_logo_url} alt='eth' />
              <div className='zamp-selected-title'>{selectedItem.network_display_name}</div>
            </div>
            <img
              src={`${ASSETS_PATH}/public/images/right-arrow.svg`}
              alt='Arrow icon'
              className={`zamp-dropdown-arrow ${isDropDownActive && 'zamp-hide-dropdown-arrow'}`}
            />
          </div>
        </div>
      </div>
      <BottomSheet
        isOpen={isBottomSheetOpen === BottomSheetTypes.NETWORK_SELECT}
        setBottomSheetOpen={setBottomSheetOpen}
      >
        <NetworkSelectBottomSheet
          setBottomSheetOpen={setBottomSheetOpen}
          availableNetwork={itemsList}
          setSelectedItem={setSelectedItem}
          onSelectItem={onSelectItem}
          selectedItem={selectedItem}
        />
      </BottomSheet>
    </div>
  ) : (
    <div className='zamp-dropdown-wrapper' ref={dropDownRef}>
      <div className={`zamp-dropdown-list ${isDropDownActive ? 'dropdown-active' : ''}`}>
        {getFilteredList().map((item) => (
          <div
            className={`zamp-dropdown-item ${
              item.network_code === selectedItem.network_code ? 'zamp-dropdown-item-selected' : ''
            }`}
            key={item.network_code}
            onClick={(e) => {
              handleItemClick(item);
              e.stopPropagation();
            }}
            role='presentation'
          >
            <div className='zamp-dropdown-text-elements' role='presentation'>
              <img className='zamp-dropdown-item-icon' src={item.network_logo_url} alt='eth' width={15} height={15} />
              <div className='zamp-selected-title'>{item.network_display_name}</div>
            </div>
            <img
              src={`${ASSETS_PATH}/public/images/right-arrow.svg`}
              alt='Arrow icon'
              className={`zamp-dropdown-arrow ${isDropDownActive && 'zamp-hide-dropdown-arrow'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelect;
