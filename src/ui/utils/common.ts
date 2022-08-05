import { ContractInterface, ethers } from 'ethers';
import { Cluster } from '@solana/web3.js';

import { AddEthereumChainParameter } from 'types/wallet';
import { USDCAbi, USDTAbi } from 'constants/abi';
import {
  MUMBAI_CHAIN_PARAMS,
  TokenTypes,
  EthChains,
  POLYGON_CHAIN_PARAMS,
  SolChains,
  SolanaCluster,
  ANDROID_WALLETCONNECT_DEEPLINK,
  CurrencyTypes,
  WalletConnectWalletNames
} from 'constants/wallet';
import { OS, REDIRECT_URLS, Wallets, WALLET_ICONS } from 'constants/common';
import { AvailableNetworks, ConnectionInformation, WalletData, WalletDetails } from 'types';
import { MOBILE_DEVICE_REGEX } from 'constants/regex';
import { getWalletMeta } from 'ui/wallets/WalletConnect';
import { ASSETS_PATH } from 'config';

const parseChain = (chain: EthChains | number) =>
  typeof chain === 'number' ? (`0x${chain.toString(16)}` as EthChains) : chain;

const parseAddress = (address: string) =>
  `${address.slice(0, 2)}${address.slice(2, 6).toUpperCase()}...${address.slice(-4).toUpperCase()}`;

const parseDecimals = (decimals: ethers.BigNumber | number) =>
  typeof decimals === 'number' ? decimals : decimals.toNumber();

const getChainParams = (chain: EthChains) => {
  if (chain === EthChains.MUMBAI) return MUMBAI_CHAIN_PARAMS;
  if (chain === EthChains.POLYGON) return POLYGON_CHAIN_PARAMS;

  return {} as AddEthereumChainParameter;
};

const getContractAbi = (token: TokenTypes) => {
  const contractAbi: ContractInterface = token === TokenTypes.USDT ? USDTAbi : USDCAbi;

  return contractAbi;
};

const getClusterFromChain = (chain: SolChains): Cluster => {
  if (chain === SolChains.DEVNET) return SolanaCluster.DEVNET;

  return SolanaCluster.MAINNET;
};

const getWalletName = (walletName: Wallets) => {
  switch (walletName) {
    case Wallets.METAMASK:
      return 'metamask';
    case Wallets.PHANTOM:
      return 'phantom';
    default:
      return '';
  }
};

const handleWalletInstallRedirect = (wallet: Wallets) => {
  const url = REDIRECT_URLS[wallet];

  window.open(url);
};

const isMobileDevice = () => MOBILE_DEVICE_REGEX.test(navigator.userAgent);

const triggerAndroidWalletDeepLink = () => {
  window.open(ANDROID_WALLETCONNECT_DEEPLINK);
};

const getLocalStorageWalletConnect = () => window.localStorage.getItem('walletconnect');

const isWalletConnect = (wallet: WalletData) => wallet.name === Wallets.WALLETCONNECT;

const isAndroid = (deviceOS: string) => deviceOS === OS.ANDROID;

const isIOS = (deviceOS: string) => deviceOS === OS.IOS;

const isTrustWallet = (walletName: string) =>
  walletName === WalletConnectWalletNames.TRUST_ANDROID || walletName === WalletConnectWalletNames.TRUST_IOS;

//TODO: image need to be fetched from BE
const getSelectedWalletIcon = (selectedWallet: WalletData) => {
  const walletMeta = getWalletMeta();

  // TODO: fallback for all popular wallets
  if (isWalletConnect(selectedWallet))
    return (
      (walletMeta?.icons && walletMeta?.icons[0]) ||
      `${ASSETS_PATH}/public/images/${
        isTrustWallet(walletMeta?.name || '') ? 'trust-wallet' : 'wallet-connect'
      }-icon.svg`
    );

  return `${ASSETS_PATH}/public/images/${getWalletName(selectedWallet.name)}-icon.svg`;
};

const getSelectedWalletName = (selectedWallet: WalletData) =>
  isWalletConnect(selectedWallet) ? getWalletMeta()?.name : selectedWallet.name;

const getFallbackWalletIcon = (wallet: Wallets) => `${ASSETS_PATH}/public/images/${WALLET_ICONS[wallet]}.svg`;

// TODO: compare with function in bitcoin branch
const copyToClipBoard = (copyText: string) => {
  navigator.clipboard.writeText(copyText);
};

const getBTCConnectionInfo = (availableNetworks: AvailableNetworks[], paymentOption: WalletDetails) => {
  const BTCNetwork =
    availableNetworks.find((item) => item.network_code === CurrencyTypes.BTC)?.network_code || CurrencyTypes.BTC;
  const connectionInfo: ConnectionInformation = {
    network_code: BTCNetwork,
    payment_option_id: paymentOption[Wallets.BTC].id
  };

  return connectionInfo;
};

export {
  parseAddress,
  parseChain,
  parseDecimals,
  getChainParams,
  getContractAbi,
  getClusterFromChain,
  getWalletName,
  getFallbackWalletIcon,
  handleWalletInstallRedirect,
  isMobileDevice,
  triggerAndroidWalletDeepLink,
  getLocalStorageWalletConnect,
  isWalletConnect,
  isAndroid,
  isIOS,
  getSelectedWalletIcon,
  getSelectedWalletName,
  copyToClipBoard,
  getBTCConnectionInfo
};
