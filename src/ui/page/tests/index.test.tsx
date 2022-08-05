// TODO: remove
/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import { configure, mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import WalletList from 'ui/page/wallet-list/WalletList';

import Content from '../index';

configure({ adapter: new Adapter() });

const zampSession = {
  paymentInfo: {
    id: 1,
    source_amount: 0
  },
  merchantConfig: {
    merchant: {},
    payment_options: [],
    available_networks: [{ network_code: 'ETH', eligible_payment_options: [] }],
    default_network: 'ETH'
  }
} as any;
// TODO: to be typed

const paymentSession = {} as any;

describe('Content', () => {
  const onPaymentCompletedMock = jest.fn();
  const onPaymentCancelMock = jest.fn();
  const mockFn = jest.fn();

  it('render / unmount page', () => {
    const wrapper = mount(
      <Content
        onPaymentCompleted={onPaymentCompletedMock}
        onPaymentCancel={onPaymentCancelMock}
        zampSession={zampSession}
        paymentSession={paymentSession}
        isError={false}
      />
    );
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
    wrapper.unmount();
  });

  it('Mount WalletList and handle setRemoveWalletListener', () => {
    const wrapper = shallow(
      <Content
        onPaymentCompleted={onPaymentCompletedMock}
        onPaymentCancel={onPaymentCancelMock}
        zampSession={zampSession}
        paymentSession={paymentSession}
        isError={false}
      />
    );
    const removeListenerMock = () => {};

    // wrapper.find(WalletList).props().setRemoveWalletListener(removeListenerMock);
  });

  it('render Coin List through WalletList', () => {
    const wrapper = shallow(
      <Content
        onPaymentCompleted={mockFn}
        onPaymentCancel={mockFn}
        zampSession={zampSession}
        paymentSession={paymentSession}
        isError={false}
      />
    );

    // wrapper.find(WalletList).props().handlePageChange(ZampfiPages.COIN_LIST);
  });

  it('render Success Screen through CoinList', () => {
    const wrapper = shallow(
      <Content
        onPaymentCompleted={mockFn}
        onPaymentCancel={mockFn}
        zampSession={zampSession}
        paymentSession={paymentSession}
        isError={false}
      />
    );

    // wrapper.find(WalletList).props().handlePageChange(ZampfiPages.COIN_LIST);
    // wrapper.find(CoinList).props().handlePageChange(ZampfiPages.SUCCESS_SCREEN);
  });

  it('render Error Screen through CoinList', () => {
    const wrapper = shallow(
      <Content
        onPaymentCompleted={mockFn}
        onPaymentCancel={mockFn}
        zampSession={zampSession}
        paymentSession={paymentSession}
        isError={false}
      />
    );

    // wrapper.find(WalletList).props().handlePageChange(ZampfiPages.COIN_LIST);
    // wrapper.find(CoinList).props().handlePageChange(ZampfiPages.ERROR_SCREEN);
  });

  it('render default invalid case', () => {
    const wrapper = shallow(
      <Content
        onPaymentCompleted={mockFn}
        onPaymentCancel={mockFn}
        zampSession={zampSession}
        paymentSession={paymentSession}
        isError={false}
      />
    );

    // wrapper.find(WalletList).props().handlePageChange('');
  });

  it('handle onPaymentComplete success, error, and invalid cases', () => {
    const wrapper = shallow(
      <Content
        onPaymentCompleted={onPaymentCompletedMock}
        onPaymentCancel={onPaymentCancelMock}
        zampSession={zampSession}
        paymentSession={paymentSession}
        isError={false}
      />
    );

    // wrapper.find(WalletList).props().handlePageChange(ZampfiPages.COIN_LIST);
    // wrapper.find(CoinList).props().handlePaymentCompleted('success');
    // wrapper.find(CoinList).props().handlePaymentCompleted(); // error case
    // wrapper.find(CoinList).props().handlePaymentCompleted('invalid');
  });
});
