import { ethers } from 'ethers';

import { AddEthereumChainParameter } from 'types/wallet';
import { getContractAbi } from 'ui/utils/common';
import {
  EthChains,
  TokenTypes,
  JsonRPCMethods,
  MetamaskEvents,
  MetamaskErrorCode,
  JsonRPCErrorCode
} from 'constants/wallet';
import { getWeb3ProviderAndSigner } from './common';

const getMetaMaskProvider = () => {
  const walletExist: any = window?.ethereum;
  let provider: any;

  // To handle multiple extension providers
  if (walletExist?.providers) provider = walletExist?.providers.find((prov: { isMetaMask: any }) => prov.isMetaMask);
  else provider = walletExist;

  return provider;
};

const connectMetaMask = async () => {
  const provider = getMetaMaskProvider();

  try {
    if (!provider) return null;

    const address: string[] = await provider.request({
      method: JsonRPCMethods.REQUEST_ACCOUNTS
    });

    return {
      success: true,
      address: address[0],
      chain: provider.chainId as EthChains,
      error: null
    };
  } catch (err: any) {
    return {
      success: err.code === MetamaskErrorCode.REQUEST_REJECT,
      address: null,
      chain: null,
      error: err.code as MetamaskErrorCode
    };
  }
};

const getMetamaskAccount = async () => {
  const provider = getMetaMaskProvider();

  try {
    if (!provider) return null;

    const address: string[] = await provider.request({
      method: JsonRPCMethods.ETH_ACCOUNTS
    });

    return address[0];
  } catch (err: any) {
    return null;
  }
};

const addMetaMaskWalletListener = (
  accountChangeHandler: (...args: any) => void,
  chainChangeHandler: (...args: any) => void
) => {
  const provider = getMetaMaskProvider();

  if (provider !== undefined) {
    provider.on(MetamaskEvents.ACCOUNT_CHANGE, accountChangeHandler);
    provider.on(MetamaskEvents.CHAIN_CHANGE, chainChangeHandler);

    return () => {
      if (window.ethereum !== undefined) {
        provider.removeListener(MetamaskEvents.ACCOUNT_CHANGE, accountChangeHandler);
        provider.removeListener(MetamaskEvents.CHAIN_CHANGE, chainChangeHandler);
      }
    };
  }

  return () => null;
};

const sendEth = async (from: string, to: string, value = '0') => {
  const provider = getMetaMaskProvider();

  try {
    if (!provider) throw new Error('No crypto wallet found. Please install it.');

    const { signer } = getWeb3ProviderAndSigner(provider as ethers.providers.ExternalProvider);

    const resp = await signer.sendTransaction({
      from,
      to,
      value: ethers.utils.parseEther(value)
    });

    return {
      success: true,
      transactionResponse: resp
    };
  } catch (err: any) {
    console.log(err);

    return {
      success: err.code !== JsonRPCErrorCode.INTERNAL_ERROR && err.code !== MetamaskErrorCode.INSUFFICIENT_FUNDS,
      transactionResponse: null
    };
  }
};

const transferToken = async (to: string, value = '0', token: TokenTypes, contractAddress: string) => {
  const provider = getMetaMaskProvider();

  try {
    const { signer } = getWeb3ProviderAndSigner(provider as ethers.providers.ExternalProvider);

    const contractAbi = getContractAbi(token);
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    const resp = await contract.transfer(to, value);

    return {
      success: true,
      transactionResponse: resp
    };
  } catch (e: any) {
    console.log(e);

    return {
      success: e.code === JsonRPCErrorCode.INTERNAL_ERROR || e.code === MetamaskErrorCode.REQUEST_REJECT,
      transactionResponse: null
    };
  }
};

const addChain = async (chainParams: AddEthereumChainParameter) => {
  const provider = getMetaMaskProvider();

  try {
    await provider.request({
      method: JsonRPCMethods.ADD_CHAIN,
      params: [chainParams]
    });

    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
};

const switchChain = async (chainId: string) => {
  const provider = getMetaMaskProvider();

  try {
    await provider.request({
      method: JsonRPCMethods.SWITCH_CHAIN,
      params: [
        {
          chainId
        }
      ]
    });

    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
};

export {
  getMetaMaskProvider,
  connectMetaMask,
  getMetamaskAccount,
  addMetaMaskWalletListener,
  sendEth,
  transferToken,
  addChain,
  switchChain
};
