import { AddEthereumChainParameter } from 'types/wallet';

enum TokenTypes {
  USDT = 'USDT',
  USDC = 'USDC'
}

enum CurrencyTypes {
  ETHEREUM = 'ETH',
  MATIC = 'MATIC',
  SOL = 'SOL',
  BTC = 'BTC'
}

enum EthChains {
  MAINNET = '0x1',
  RINKEBY = '0x4',
  GOERLI = '0x5',
  POLYGON = '0x89',
  MUMBAI = '0x13881'
}

enum SolChains {
  MAINNET = 'SOL-mainnet-beta',
  DEVNET = 'SOL-devnet'
}

enum BlockParameters {
  EARLIEST = 'earliest',
  LATEST = 'latest',
  PENDING = 'pending'
}

enum JsonRPCMethods {
  REQUEST_ACCOUNTS = 'eth_requestAccounts',
  GET_BALANCE = 'eth_getBalance',
  ADD_CHAIN = 'wallet_addEthereumChain',
  SWITCH_CHAIN = 'wallet_switchEthereumChain',
  ETH_ACCOUNTS = 'eth_accounts'
}

enum MetamaskEvents {
  CONNECT = 'connect',
  ACCOUNT_CHANGE = 'accountsChanged',
  CHAIN_CHANGE = 'chainChanged',
  DISCONNECT = 'disconnect'
}

enum WalletConnectEvents {
  ACCOUNT_CHANGE = 'accountsChanged',
  CHAIN_CHANGE = 'chainChanged',
  DISCONNECT = 'disconnect',
  DISPLAY_URI = 'display_uri',
  CALL_REQUEST = 'call_request_sent'
}

enum ContractFunctions {
  TRANSFER = 'transfer'
}

enum SolanaCluster {
  DEVNET = 'devnet',
  MAINNET = 'mainnet-beta'
}

enum JsonRPCErrorCode {
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603 // Usually insufficient funds
}

enum MetamaskErrorCode {
  REQUEST_REJECT = 4001,
  EXISTING_REQUEST = -32002,
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS'
}

enum PhantomErrorCode {
  REQUEST_REJECT = 4001
}

// Names stored by WalletConnect in WalletMeta object
// TODO: Fill enum with popular wallets
enum WalletConnectWalletNames {
  METAMASK = 'MetaMask',
  TRUST_IOS = 'Trust Wallet',
  TRUST_ANDROID = 'Trust Wallet Android'
}

const MUMBAI_CHAIN_PARAMS: AddEthereumChainParameter = {
  chainId: EthChains.MUMBAI,
  chainName: 'Mumbai Testnet',
  rpcUrls: ['https://rpc-mumbai.maticvigil.com/v1/a5c2a306e82b2d8b623093cd4cbf9ecd19cf55ed'],
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MAT',
    decimals: 18
  },
  blockExplorerUrls: ['https://mumbai.polygonscan.com/']
};

const POLYGON_CHAIN_PARAMS: AddEthereumChainParameter = {
  chainId: EthChains.POLYGON,
  chainName: 'Polygon',
  rpcUrls: ['https://polygon-rpc.com'],
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MAT',
    decimals: 18
  },
  blockExplorerUrls: ['https://polygonscan.com/']
};

const SOLANA_TOKEN_ACCOUNT_PRIVATE_KEY =
  '5bxnaHML411GgyKQ9zZgk18wFmzUWumaiYtNgp82vqGbVaXVjxSGxbQfYxQ3ML53ABPCniuqGYvRKVTAKJARpZRw';

const SOLANA_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_KEY = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

// Generic link for all supported crypto wallets in android
const ANDROID_WALLETCONNECT_DEEPLINK = 'wc:00e46b69-d0cc-4b3e-b6a2-cee442f97188@1';

// Metamask specific link (currently has issues in Android 12)
const METAMASK_APP_DEEPLINK = 'metamask://wc?uri=wc:x';

export {
  CurrencyTypes,
  TokenTypes,
  EthChains,
  SolChains,
  BlockParameters,
  JsonRPCMethods,
  JsonRPCErrorCode,
  MetamaskEvents,
  PhantomErrorCode,
  WalletConnectWalletNames,
  WalletConnectEvents,
  ContractFunctions,
  SolanaCluster,
  MetamaskErrorCode,
  MUMBAI_CHAIN_PARAMS,
  POLYGON_CHAIN_PARAMS,
  SOLANA_TOKEN_ACCOUNT_PRIVATE_KEY,
  SOLANA_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_KEY,
  ANDROID_WALLETCONNECT_DEEPLINK,
  METAMASK_APP_DEEPLINK
};
