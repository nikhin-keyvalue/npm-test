import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

import { Wallets } from 'constants/common';
import { ContractFunctions, EthChains, TokenTypes } from 'constants/wallet';
import { getContractAbi, parseDecimals } from '../utils/common';
import { getMetaMaskProvider } from './Metamask';
import { getWalletConnectProvider } from './WalletConnect';

const getContractData = (contract: ethers.Contract, functionName: ContractFunctions, params: any[]) => {
  const iface = contract.interface;
  const data = iface.encodeFunctionData(functionName, params);

  return data;
};

const getWeb3ProviderAndSigner = (provider: ethers.providers.ExternalProvider) => {
  const web3provider = new ethers.providers.Web3Provider(provider);
  const signer = web3provider.getSigner();

  return {
    web3provider,
    signer
  };
};

const getTokenDecimals = async (contract: ethers.Contract) => {
  const decimalsResp: ethers.BigNumber = await contract.decimals();

  return parseDecimals(decimalsResp);
};

const getEthProvider = (wallet: Wallets) => {
  switch (wallet) {
    case Wallets.METAMASK:
      return getMetaMaskProvider();
    case Wallets.WALLETCONNECT:
      return getWalletConnectProvider();
    default:
      return null;
  }
};

const getEthBalance = async (address: string, wallet: Wallets) => {
  try {
    const provider: ethers.providers.ExternalProvider | WalletConnectProvider = getEthProvider(wallet);

    const { web3provider } = getWeb3ProviderAndSigner(provider);
    const balance = await web3provider.getBalance(address);

    return balance;
  } catch (err: any) {
    return 0;
  }
};

const getTokenBalance = async (
  address: string,
  token: TokenTypes,
  chain: EthChains,
  contractAddress: string,
  wallet: Wallets
) => {
  try {
    const provider: ethers.providers.ExternalProvider | WalletConnectProvider = getEthProvider(wallet);
    const { signer } = getWeb3ProviderAndSigner(provider);

    const contractAbi = getContractAbi(token);
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    const balanceResp: ethers.BigNumber = await contract.balanceOf(address);
    const decimals = await getTokenDecimals(contract);
    // TODO: toNumber breaks when balance to large
    const balance = balanceResp.toNumber();

    return balance / Math.pow(10, decimals);
  } catch (err: any) {
    console.log(err);

    return 0;
  }
};

export { getContractData, getWeb3ProviderAndSigner, getTokenDecimals, getEthBalance, getTokenBalance };
