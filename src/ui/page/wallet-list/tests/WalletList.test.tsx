// TODO: To be removed
/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import { configure, mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import WalletList from 'ui/page/wallet-list/WalletList';
import * as metamask from 'ui/wallets/Metamask';
import { EthChains } from 'constants/wallet';
import { AvailableNetworks, WalletDetails } from 'types';
import { Wallets } from 'constants/common';

// TODO: Fix issues
configure({ adapter: new Adapter() });

const walletList = [
  {
    id: 'probo_po_9GthjB6rbcvwb7eP5xid_05_27',
    name: 'Metamask',
    type: 'wallet'
  }
] as any;
const walletDetails: WalletDetails = {
  Metamask: {
    id: '',
    logo_url: '',
    name: Wallets.METAMASK,
    type: ''
  },
  Phantom: {
    id: '',
    logo_url: '',
    name: Wallets.PHANTOM,
    type: ''
  },
  WalletConnect: {
    id: '',
    logo_url: '',
    name: Wallets.WALLETCONNECT,
    type: ''
  },
  Binance: {
    id: '',
    logo_url: '',
    name: Wallets.BINANCE,
    type: ''
  },
  QRCode: {
    id: '',
    logo_url: '',
    name: Wallets.BTC,
    type: ''
  }
};

const selectedChainObject: AvailableNetworks = {
  network_chain_id: EthChains.RINKEBY,
  network_code: 'ETH',
  network_display_name: 'ETHEREUM',
  network_logo_url: '',
  eligible_payment_options: [Wallets.METAMASK],
  rpc_url: ''
};

const rpcUrls = new Map([[0, '']]);

describe('WalletList', () => {
  const mockFn = jest.fn();

  it('render components', () => {
    const wrapper = mount(
      <WalletList
        setSelectedWallet={mockFn}
        setAddress={mockFn}
        selectedChainObject={selectedChainObject}
        setCurrentChain={mockFn}
        walletList={walletDetails}
        setRemoveWalletListener={mockFn}
        onWalletConnected={() => null}
        setModalOpen={mockFn}
        rpcUrls={rpcUrls}
      />
    );
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });

  it('handle metamask connect click on success', async () => {
    const onHandleWalletsPageMock = jest.fn();
    const setSelectedWalletMock = jest.fn();
    const setRemoveWalletListenerMock = jest.fn();
    const setAddressMock = jest.fn();
    const setChainMock = jest.fn();

    const wrapper = shallow(
      <WalletList
        setSelectedWallet={setSelectedWalletMock}
        setAddress={setAddressMock}
        setCurrentChain={setChainMock}
        selectedChainObject={selectedChainObject}
        walletList={walletDetails}
        setRemoveWalletListener={setRemoveWalletListenerMock}
        onWalletConnected={() => null}
        setModalOpen={mockFn}
        rpcUrls={rpcUrls}
      />
    );

    const mock = jest.spyOn(metamask, 'connectMetaMask');

    mock.mockImplementation(async () => {
      return {
        success: true,
        address: '0x12345',
        chain: EthChains.RINKEBY,
        balance: 0,
        error: null
      };
    });

    // await wrapper.find('div.zamp-wallet-container').at(1).simulate('click');
    // expect(onHandleWalletsPageMock).toHaveBeenCalled();
    // expect(setSelectedWalletMock).toHaveBeenCalled();
    // expect(setAddressMock).toHaveBeenCalled();
    // expect(setChainMock).toHaveBeenCalled();
    // expect(setRemoveWalletListenerMock).toHaveBeenCalled();
  });

  it('handle metamask connect click on fail', async () => {
    const onHandleWalletsPageMock = jest.fn();
    const mockFn = jest.fn();

    const wrapper = shallow(
      <WalletList
        setSelectedWallet={mockFn}
        setAddress={mockFn}
        setCurrentChain={mockFn}
        selectedChainObject={selectedChainObject}
        walletList={walletDetails}
        setRemoveWalletListener={mockFn}
        onWalletConnected={() => null}
        setModalOpen={mockFn}
        rpcUrls={rpcUrls}
      />
    );

    const mock = jest.spyOn(metamask, 'connectMetaMask');

    mock.mockImplementation(async () => {
      return {
        success: false,
        address: null,
        chain: null,
        balance: 0,
        error: 4001
      };
    });

    // await wrapper.find('div.zamp-wallet-container').at(1).simulate('click');
    // expect(onHandleWalletsPageMock).toHaveBeenCalled();
  });
});
