import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

import {
  ContractFunctions,
  EthChains,
  METAMASK_APP_DEEPLINK,
  TokenTypes,
  WalletConnectEvents,
  WalletConnectWalletNames
} from 'constants/wallet';
import { getContractData, getWeb3ProviderAndSigner } from './common';
import { getContractAbi, isIOS, parseChain } from 'ui/utils/common';

let walletConnectProvider: WalletConnectProvider;

const connectProvider = (chainId: EthChains, rpcUrls: Map<number, string>) => {
  const rpc = Object.fromEntries(rpcUrls);

  walletConnectProvider = new WalletConnectProvider({
    chainId: Number(chainId),
    rpc,
    qrcodeModalOptions: {
      desktopLinks: []
    }
  });
};

const getWalletConnectProvider = () => walletConnectProvider;

const getWalletMeta = () => getWalletConnectProvider()?.walletMeta;

const getWalletConnectAccount = () => {
  if (walletConnectProvider.accounts) return walletConnectProvider.accounts[0];

  return null;
};

const connectWalletConnect = async (
  chainId: EthChains,
  deviceOS: string,
  accountChangeHandler: any,
  chainChangeHandler: any,
  disconnectHandler: () => void,
  rpcUrls: Map<number, string>
) => {
  connectProvider(chainId, rpcUrls);
  try {
    walletConnectProvider.on(WalletConnectEvents.ACCOUNT_CHANGE, accountChangeHandler);
    walletConnectProvider.on(WalletConnectEvents.CHAIN_CHANGE, chainChangeHandler);
    walletConnectProvider.on(WalletConnectEvents.DISCONNECT, disconnectHandler);

    await walletConnectProvider.enable();

    // In order to handle metamask ios deeplink bug
    if (isIOS(deviceOS) && walletConnectProvider.walletMeta?.name === WalletConnectWalletNames.METAMASK)
      walletConnectProvider.connector.on(WalletConnectEvents.CALL_REQUEST, () => {
        window.open(METAMASK_APP_DEEPLINK, '_parent');
      });

    return {
      success: true,
      address: walletConnectProvider.accounts[0],
      chain: parseChain(walletConnectProvider.chainId)
    };
  } catch (e: any) {
    return {
      success: false,
      address: '',
      chain: ''
    };
  }
};

const disconnectWalletConnect = async () => {
  if (walletConnectProvider) await walletConnectProvider.disconnect();
};

const WalletConnectSendEth = async (to: string, value = '0') => {
  try {
    const provider = new ethers.providers.Web3Provider(walletConnectProvider);
    const signer = provider.getSigner();

    const resp = await signer.sendTransaction({
      from: walletConnectProvider?.accounts[0],
      to,
      value: ethers.utils.parseEther(value)
    });

    return {
      success: true,
      transactionResponse: resp
    };
  } catch (e) {
    return {
      success: false,
      transactionResponse: null
    };
  }
};

const transferTokenWalletConnect = async (to: string, value = '0', token: TokenTypes, contractAddress: string) => {
  try {
    const { web3provider, signer } = getWeb3ProviderAndSigner(walletConnectProvider);

    const contractAbi = getContractAbi(token);
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    const gasPrice = await web3provider.getGasPrice();

    const data = getContractData(contract, ContractFunctions.TRANSFER, [to, value]);

    const resp = await signer.sendTransaction({
      from: walletConnectProvider?.accounts[0],
      to: contractAddress,
      data,
      gasPrice
    });

    return {
      success: true,
      transactionResponse: resp
    };
  } catch (e) {
    return {
      success: false,
      transactionResponse: null
    };
  }
};

export {
  connectProvider,
  connectWalletConnect,
  getWalletConnectProvider,
  getWalletMeta,
  getWalletConnectAccount,
  disconnectWalletConnect,
  WalletConnectSendEth,
  transferTokenWalletConnect
};
