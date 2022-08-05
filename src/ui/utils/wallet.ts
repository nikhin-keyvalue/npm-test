import { ethers } from 'ethers';

import { Wallets } from 'constants/common';
import { CoinData } from 'types';
import { CurrencyTypes, EthChains, SolChains, TokenTypes } from 'constants/wallet';
import { Balance, ChainTypes, CoinTypes } from 'types/wallet';
import { getEthBalance, getTokenBalance } from '../wallets/common';
import { getSolBalance, getSolTokenBalance } from '../wallets/Phantom';

const isSolChain = (chain: ChainTypes): chain is SolChains => chain === SolChains.DEVNET || chain === SolChains.MAINNET;

const isEthChain = (chain: ChainTypes): chain is EthChains =>
  chain === EthChains.MAINNET ||
  chain === EthChains.RINKEBY ||
  chain === EthChains.POLYGON ||
  chain === EthChains.MUMBAI;

const isEthereumBasedCoin = (coin: CoinTypes): coin is CurrencyTypes.ETHEREUM | CurrencyTypes.MATIC =>
  coin === CurrencyTypes.ETHEREUM || coin === CurrencyTypes.MATIC;

const isSolBasedCoin = (coin: CoinTypes): coin is CurrencyTypes.SOL => coin === CurrencyTypes.SOL;

const isToken = (coin: CoinTypes): coin is TokenTypes => coin === TokenTypes.USDC || coin === TokenTypes.USDT;

const getCurrencyFromChain = (chain: ChainTypes) => {
  if (chain === EthChains.MAINNET || chain === EthChains.RINKEBY) return CurrencyTypes.ETHEREUM;
  else if (chain === EthChains.POLYGON || chain === EthChains.MUMBAI) return CurrencyTypes.MATIC;
  else if (chain === SolChains.DEVNET || chain === SolChains.MAINNET) return CurrencyTypes.SOL;

  return '' as CurrencyTypes;
};

const getEthBalancesArray = async (
  address: string,
  tokenList: CoinData[],
  chain: EthChains,
  selectedWallet: Wallets
) => {
  const balance = await getEthBalance(address, selectedWallet);
  const mainBalance: Balance = {
    coin: getCurrencyFromChain(chain),
    balance: Number(ethers.utils.formatEther(balance))
  };

  const tokenBalances = await Promise.all(
    tokenList.map(async (item) => {
      if (item) {
        const tokenBalance = await getTokenBalance(
          address,
          item.currency_code as TokenTypes,
          chain,
          item.contract_address,
          selectedWallet
        );

        return {
          coin: item.currency_code,
          balance: tokenBalance
        } as Balance;
      }

      return {
        coin: null,
        balance: 0
      };
    })
  );

  return [mainBalance, ...tokenBalances];
};

const getSolBalancesArray = async (address: string, tokenList: CoinData[], chain: SolChains) => {
  const balance = await getSolBalance(address, chain);
  const mainBalance: Balance = {
    coin: getCurrencyFromChain(chain),
    balance
  };

  const tokenBalances = await Promise.all(
    tokenList.map(async (item) => {
      if (item) {
        const tokenBalance = await getSolTokenBalance(address, item.contract_address, chain);

        return {
          coin: item.currency_code,
          balance: tokenBalance
        } as Balance;
      }

      return {
        coin: null,
        balance: 0
      };
    })
  );

  return [mainBalance, ...tokenBalances];
};

const isValidBalance = (balance: Balance[]) => {
  if (balance.length) {
    // TODO: make function
    const coins: CoinTypes[] = [...Object.values(CurrencyTypes), ...Object.values(TokenTypes)];
    let valid = true;

    balance.forEach((item) => {
      if (!(item.coin && coins.includes(item.coin))) valid = false;

      return;
    });

    return valid;
  } else {
    return false;
  }
};

export {
  isSolChain,
  isEthChain,
  isEthereumBasedCoin,
  isSolBasedCoin,
  isToken,
  getCurrencyFromChain,
  getEthBalancesArray,
  getSolBalancesArray,
  isValidBalance
};
