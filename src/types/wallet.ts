import { TransactionResponse } from '@ethersproject/abstract-provider';

import { CurrencyTypes, EthChains, MetamaskErrorCode, SolChains, TokenTypes } from 'constants/wallet';

export type CoinTypes = CurrencyTypes | TokenTypes;

export type ChainTypes = EthChains | SolChains;

export type AddEthereumChainParameter = {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored by metamask
};

export type TransferOrSendResponse = {
  success: boolean;
  transactionResponse: TransactionResponse | null;
};

export type Balance = {
  coin: CoinTypes | null;
  balance: number;
};

export type SolTransferOrSendResponse = {
  success: boolean;
  transactionResponse: string | null;
};

export type MetamaskConnectionResponse = {
  success: boolean;
  address: string | null;
  chain: EthChains | null;
  error: MetamaskErrorCode | null;
} | null;

export type WalletConnectConnectionResponse =
  | {
      success: boolean;
      address: string | null;
      chain: EthChains | null;
    }
  | undefined;

export type PhantomConnectionResponse =
  | {
      success: boolean;
      address: string | null;
    }
  | undefined;

export type ConnectionResponse =
  | MetamaskConnectionResponse
  | WalletConnectConnectionResponse
  | PhantomConnectionResponse;
