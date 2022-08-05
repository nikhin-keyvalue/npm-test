// TODO: remove
/* eslint-disable @typescript-eslint/no-unused-vars */

import { h } from 'preact';
import { configure, mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Adapter } from 'enzyme-adapter-preact-pure';

import CoinList from 'ui/page/coin-list/CoinList';
import * as metamask from 'ui/wallets/Metamask';
import { CurrencyTypes, EthChains } from 'constants/wallet';
import { CoinData, WalletData, WalletDetails } from 'types';
import { TransferOrSendResponse } from 'types/wallet';
import { Wallets } from 'constants/common';

configure({ adapter: new Adapter() });

describe('CoinList', () => {
  const amountWithExchangeRate: CoinData[] = [
    {
      amount: '0',
      exchange_rate: '0',
      currency_code: CurrencyTypes.ETHEREUM,
      display_name: 'Ethereum',
      type: 'crypto',
      logo_url: '',
      contract_address: '',
      lowest_denom_amount: ''
    }
  ];

  const walletDetails: WalletData = {
    id: '',
    logo_url: '',
    name: Wallets.METAMASK,
    type: ''
  };

  const mockFn = jest.fn();

  jest.useFakeTimers();
  it('render components', () => {
    const wrapper = mount(
      <CoinList
        handlePageChange={mockFn}
        setSelectedCoinObject={mockFn}
        setSelectedAmount={mockFn}
        onCoinSelect={mockFn}
        onTransactionCompleted={mockFn}
        currentChain={EthChains.RINKEBY}
        selectedChain={EthChains.RINKEBY}
        amount={'0'}
        sourceCurrency={'USD'}
        address={'0x1234'}
        balances={[]}
        convertedAmounts={amountWithExchangeRate}
        setModalOpen={mockFn}
        selectedWallet={walletDetails}
        isPaymentStarted={false}
        setIsPaymentStarted={mockFn}
        isBottomSheetOpen={null}
        setBottomSheetOpen={() => null}
        setCurrentPage={mockFn}
      />
    );
    const tree = shallowToJson(wrapper);

    expect(tree).toMatchSnapshot();
  });

  it('handle pay Coins click', async () => {
    const onHandleCoinsPageMock = jest.fn();
    const setSelectedCoinMock = jest.fn();
    const wrapper = shallow(
      <CoinList
        handlePageChange={onHandleCoinsPageMock}
        setSelectedAmount={mockFn}
        setSelectedCoinObject={mockFn}
        onCoinSelect={mockFn}
        onTransactionCompleted={mockFn}
        currentChain={EthChains.RINKEBY}
        selectedChain={EthChains.RINKEBY}
        amount={'0'}
        sourceCurrency={'USD'}
        address={'0x1234'}
        convertedAmounts={amountWithExchangeRate}
        balances={[]}
        setModalOpen={mockFn}
        selectedWallet={walletDetails}
        isPaymentStarted={false}
        setIsPaymentStarted={mockFn}
        isBottomSheetOpen={null}
        setBottomSheetOpen={() => null}
        setCurrentPage={mockFn}
      />
    );
    const sendEthMock = jest.spyOn(metamask, 'sendEth');

    sendEthMock.mockImplementation(async () => {
      return {
        success: true,
        transactionResponse: {
          hash: '0x1234',
          confirmations: 1,
          from: '0x1234'
        }
      } as TransferOrSendResponse;
    });

    const transferTokenMock = jest.spyOn(metamask, 'transferToken');

    transferTokenMock.mockImplementation(async () => {
      return {
        success: true,
        transactionResponse: {
          hash: '0x1234',
          confirmations: 1,
          from: '0x1234'
        }
      } as TransferOrSendResponse;
    });

    const switchChainMock = jest.spyOn(metamask, 'switchChain');
    const addChainMock = jest.spyOn(metamask, 'addChain');

    switchChainMock.mockImplementation(async () => true);
    addChainMock.mockImplementation(async () => true);

    // pay ETH
    // await wrapper.find(Button).at(0).props().handleButtonClick();

    // pay USDT
    // await wrapper.find(Button).at(2).props().handleButtonClick();
    jest.advanceTimersByTime(50000);

    // expect(onHandleCoinsPageMock).toHaveBeenCalled();
    // expect(setSelectedCoinMock).toHaveBeenCalled();
  });

  it('handle pay MATIC click', async () => {
    const onHandleCoinsPageMock = jest.fn();
    const setSelectedCoinMock = jest.fn();
    const handlePaymentCompletedMock = jest.fn();
    const wrapper = shallow(
      <CoinList
        handlePageChange={onHandleCoinsPageMock}
        setSelectedAmount={mockFn}
        setSelectedCoinObject={mockFn}
        onCoinSelect={mockFn}
        onTransactionCompleted={mockFn}
        currentChain={EthChains.RINKEBY}
        selectedChain={EthChains.RINKEBY}
        amount={'0'}
        sourceCurrency={'USD'}
        address={'0x1234'}
        convertedAmounts={amountWithExchangeRate}
        balances={[]}
        setModalOpen={mockFn}
        selectedWallet={walletDetails}
        isPaymentStarted={false}
        setIsPaymentStarted={mockFn}
        isBottomSheetOpen={null}
        setBottomSheetOpen={() => null}
        setCurrentPage={mockFn}
      />
    );
    const sendEthMock = jest.spyOn(metamask, 'sendEth');

    sendEthMock.mockImplementation(async () => {
      return {
        success: true,
        transactionResponse: {
          hash: '0x1234',
          confirmations: 1,
          from: '0x1234'
        }
      } as TransferOrSendResponse;
    });

    const switchChainMock = jest.spyOn(metamask, 'switchChain');
    const addChainMock = jest.spyOn(metamask, 'addChain');

    switchChainMock.mockImplementation(async () => true);
    addChainMock.mockImplementation(async () => true);

    // pay MAT
    // await wrapper.find(Button).at(1).props().handleButtonClick();
  });

  it('handle pay Coins click fail', async () => {
    const mockFn = jest.fn();
    const wrapper = shallow(
      <CoinList
        handlePageChange={mockFn}
        setSelectedCoinObject={mockFn}
        setSelectedAmount={mockFn}
        onTransactionCompleted={mockFn}
        currentChain={EthChains.RINKEBY}
        selectedChain={EthChains.RINKEBY}
        onCoinSelect={mockFn}
        amount={'0'}
        sourceCurrency={'USD'}
        address={'0x1234'}
        convertedAmounts={amountWithExchangeRate}
        balances={[]}
        setModalOpen={mockFn}
        selectedWallet={walletDetails}
        isPaymentStarted={false}
        setIsPaymentStarted={mockFn}
        isBottomSheetOpen={null}
        setBottomSheetOpen={() => null}
        setCurrentPage={mockFn}
      />
    );
    const sendEthMock = jest.spyOn(metamask, 'sendEth');

    sendEthMock.mockImplementation(async () => {
      return {
        success: true,
        transactionResponse: null
      };
    });

    // pay ETH (fail)
    // await wrapper.find(Button).at(0).props().handleButtonClick();
  });
});
