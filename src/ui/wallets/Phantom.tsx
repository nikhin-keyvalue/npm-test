import {
  PublicKey,
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  Account,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { decode as bs58Decode } from 'bs58';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import {
  PhantomErrorCode,
  SOLANA_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_KEY,
  SOLANA_TOKEN_ACCOUNT_PRIVATE_KEY,
  SolChains
} from 'constants/wallet';
import { getClusterFromChain } from 'ui/utils/common';

const getProvider = () => {
  if ('solana' in window) {
    const provider = window.solana;

    if (provider.isPhantom) return provider;
    else return null;
  }
};

async function findAssociatedTokenAddress(walletAddress: PublicKey, tokenMintAddress: PublicKey): Promise<PublicKey> {
  const splAssociatedTokenAccountPgmID: PublicKey = new PublicKey(SOLANA_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_KEY);

  return (
    await PublicKey.findProgramAddress(
      [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
      splAssociatedTokenAccountPgmID
    )
  )[0];
}

const getSolBalance = async (address: string, chain: SolChains) => {
  try {
    const cluster = getClusterFromChain(chain);
    const connection = new Connection(clusterApiUrl(cluster));
    const balance = await connection.getBalance(new PublicKey(address));

    return balance / LAMPORTS_PER_SOL;
  } catch (error: any) {
    console.log('Error: ', error);

    return 0;
  }
};

const getSolTokenBalance = async (
  address: string,
  // TODO: check if tokenMint can be removed
  tokenmint: string,
  chain: SolChains
) => {
  try {
    const cluster = getClusterFromChain(chain);
    const connection = new Connection(clusterApiUrl(cluster));
    const tokenaddress = await findAssociatedTokenAddress(new PublicKey(address), new PublicKey(tokenmint));
    const tokenBalance = await connection.getTokenAccountBalance(tokenaddress);

    return parseFloat(tokenBalance.value.amount) / 10 ** 6;
  } catch (error: any) {
    console.log('Error: ', error);

    return 0;
  }
};

const getCurrentPhantomAccount = () => {
  const solana = getProvider();

  if (solana?.publicKey) return solana.publicKey.toString() as string;

  return null;
};

const connectPhantom = async () => {
  const solana = getProvider();

  try {
    if (solana) {
      const response = await solana.connect();

      return {
        success: true,
        address: response.publicKey.toString() as string
      };
    } else {
      return null;
    }
  } catch (err: any) {
    console.log(err);

    return {
      success: err.code === PhantomErrorCode.REQUEST_REJECT,
      address: null
    };
  }
};

const disconnectPhantom = async () => {
  const solana = getProvider();

  if (solana) await solana.disconnect();
};

const sendSol = async (from: string, to: string, value = '0', chain: SolChains) => {
  const provider = getProvider();
  const cluster = getClusterFromChain(chain);
  const connection = new Connection(clusterApiUrl(cluster));

  try {
    if (!provider) throw new Error('No crypto wallet found. Please install it.');

    const toPublicKey = new PublicKey(to);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: toPublicKey,
        lamports: Number(value)
      })
    );

    transaction.feePayer = await provider.publicKey;
    const blockhashObj = await connection.getLatestBlockhash();

    transaction.recentBlockhash = await blockhashObj.blockhash;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());

    return {
      success: true,
      transactionResponse: signature
    };
  } catch (err: any) {
    console.log(err);

    return {
      success: err.code === PhantomErrorCode.REQUEST_REJECT,
      transactionResponse: null
    };
  }
};

const transferSolToken = async (to: string, value: string, chain: SolChains, contractAddress: string) => {
  const associatedTokenProgramId = new PublicKey(contractAddress);
  //PROVIDER---CONFIG//
  const provider = getProvider();
  const cluster = getClusterFromChain(chain);
  const connection = new Connection(clusterApiUrl(cluster));
  const fromWallet = provider.publicKey;

  const account = new Account(bs58Decode(SOLANA_TOKEN_ACCOUNT_PRIVATE_KEY));
  const toWallet = new PublicKey(to);

  try {
    const fromToken = await getOrCreateAssociatedTokenAccount(
      connection,
      account,
      associatedTokenProgramId,
      fromWallet
    );
    const fromTokenAccount = fromToken.address;
    const toToken = await getOrCreateAssociatedTokenAccount(connection, account, associatedTokenProgramId, toWallet);
    const toTokenAccount = toToken.address;

    // Add token transfer instructions to transaction
    const transaction = new Transaction().add(
      createTransferInstruction(fromTokenAccount, toTokenAccount, fromWallet, Number(value), [], TOKEN_PROGRAM_ID)
    );

    // Sign transaction, broadcast, and confirm
    transaction.feePayer = await fromWallet;
    const blockhashObj = await connection.getRecentBlockhash();

    transaction.recentBlockhash = await blockhashObj.blockhash;
    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());

    return {
      success: true,
      transactionResponse: signature
    };
  } catch (e: any) {
    console.log(e);

    return {
      success: e.code === PhantomErrorCode.REQUEST_REJECT,
      transactionResponse: null
    };
  }
};

export {
  connectPhantom,
  disconnectPhantom,
  sendSol,
  transferSolToken,
  getSolBalance,
  getSolTokenBalance,
  getCurrentPhantomAccount
};
