import Preact, { h } from 'preact';

import { AvailableNetworks, NetworkSelectProps } from 'types';

import './style.scss';

const NetworkSelectBottomSheet: Preact.FunctionComponent<NetworkSelectProps> = ({
  setBottomSheetOpen,
  availableNetwork,
  onSelectItem,
  setSelectedItem,
  selectedItem
}) => {
  const handleNetworkSelect = (item) => {
    setBottomSheetOpen(null);
    setSelectedItem(item);
    onSelectItem(item);
  };

  const getFilteredList = (availableNetwork: AvailableNetworks[]) =>
    availableNetwork.filter((item) => item.eligible_payment_options);

  return (
    <div className='zamp-network-select-bottomsheet-wrapper'>
      <div className='zamp-network-select-bottomsheet-header'>Choose Network</div>
      <div className='zamp-network-select-bottomsheet-list'>
        {getFilteredList(availableNetwork).map((item) => (
          <div
            className={`zamp-network-select-bottomsheet-item ${
              item.network_code === selectedItem.network_code ? 'zamp-network-select-bottomsheet-item-selected' : ''
            }`}
            key={item.network_code}
            onClick={() => handleNetworkSelect(item)}
            role='presentation'
          >
            <div className='zamp-network-select-bottomsheet-text-elements' role='presentation'>
              <img
                className='zamp-network-select-bottomsheet-item-icon'
                src={item.network_logo_url}
                alt='eth'
                width={15}
                height={15}
              />
              <div className='zamp-selected-title'>{item.network_display_name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelectBottomSheet;
