import { ReadContractParameters, ReadContractReturnType, TransactionRequest, TransactionSerializable } from "viem";
import { EvmWalletProvider } from "./evmWalletProvider";
import { Network } from "../network";
import { CreateERC20Options, CreateTradeOptions, SmartContract, Trade, Wallet, WalletData } from "@coinbase/coinbase-sdk";
/**
 * Configuration options for the CDP Providers.
 */
export interface CdpProviderConfig {
    /**
     * The CDP API Key Name.
     */
    apiKeyName?: string;
    /**
     * The CDP API Key Private Key.
     */
    apiKeyPrivateKey?: string;
}
/**
 * Configuration options for the CdpActionProvider.
 */
export interface CdpWalletProviderConfig extends CdpProviderConfig {
    /**
     * The CDP Wallet.
     */
    wallet?: Wallet;
    /**
     * The address of the wallet.
     */
    address?: string;
    /**
     * The network of the wallet.
     */
    network?: Network;
    /**
     * The network ID of the wallet.
     */
    networkId?: string;
    /**
     * Configuration for gas multipliers.
     */
    gas?: {
        /**
         * An internal multiplier on gas limit estimation.
         */
        gasLimitMultiplier?: number;
        /**
         * An internal multiplier on fee per gas estimation.
         */
        feePerGasMultiplier?: number;
    };
}
/**
 * Configuration options for the CDP Agentkit with a Wallet.
 */
interface ConfigureCdpAgentkitWithWalletOptions extends CdpWalletProviderConfig {
    /**
     * The data of the CDP Wallet as a JSON string.
     */
    cdpWalletData?: string;
    /**
     * The mnemonic phrase of the wallet.
     */
    mnemonicPhrase?: string;
}
/**
 * A wallet provider that uses the Coinbase SDK.
 */
export declare class CdpWalletProvider extends EvmWalletProvider {
    #private;
    /**
     * Constructs a new CdpWalletProvider.
     *
     * @param config - The configuration options for the CdpWalletProvider.
     */
    private constructor();
    /**
     * Configures a new CdpWalletProvider with a wallet.
     *
     * @param config - Optional configuration parameters
     * @returns A Promise that resolves to a new CdpWalletProvider instance
     * @throws Error if required environment variables are missing or wallet initialization fails
     */
    static configureWithWallet(config?: ConfigureCdpAgentkitWithWalletOptions): Promise<CdpWalletProvider>;
    /**
     * Signs a message.
     *
     * @param message - The message to sign.
     * @returns The signed message.
     */
    signMessage(message: string): Promise<`0x${string}`>;
    /**
     * Signs a typed data object.
     *
     * @param typedData - The typed data object to sign.
     * @returns The signed typed data object.
     */
    signTypedData(typedData: any): Promise<`0x${string}`>;
    /**
     * Signs a transaction.
     *
     * @param transaction - The transaction to sign.
     * @returns The signed transaction.
     */
    signTransaction(transaction: TransactionRequest): Promise<`0x${string}`>;
    /**
     * Sends a transaction.
     *
     * @param transaction - The transaction to send.
     * @returns The hash of the transaction.
     */
    sendTransaction(transaction: TransactionRequest): Promise<`0x${string}`>;
    /**
     * Prepares a transaction.
     *
     * @param to - The address to send the transaction to.
     * @param value - The value of the transaction.
     * @param data - The data of the transaction.
     * @returns The prepared transaction.
     */
    prepareTransaction(to: `0x${string}`, value: bigint, data: `0x${string}`): Promise<TransactionSerializable>;
    /**
     * Adds signature to a transaction and serializes it for broadcast.
     *
     * @param transaction - The transaction to sign.
     * @param signature - The signature to add to the transaction.
     * @returns A serialized transaction.
     */
    addSignatureAndSerialize(transaction: TransactionSerializable, signature: `0x${string}`): Promise<string>;
    /**
     * Gets the address of the wallet.
     *
     * @returns The address of the wallet.
     */
    getAddress(): string;
    /**
     * Gets the network of the wallet.
     *
     * @returns The network of the wallet.
     */
    getNetwork(): Network;
    /**
     * Gets the name of the wallet provider.
     *
     * @returns The name of the wallet provider.
     */
    getName(): string;
    /**
     * Gets the balance of the wallet.
     *
     * @returns The balance of the wallet in wei
     */
    getBalance(): Promise<bigint>;
    /**
     * Waits for a transaction receipt.
     *
     * @param txHash - The hash of the transaction to wait for.
     * @returns The transaction receipt.
     */
    waitForTransactionReceipt(txHash: `0x${string}`): Promise<any>;
    /**
     * Reads a contract.
     *
     * @param params - The parameters to read the contract.
     * @returns The response from the contract.
     */
    readContract(params: ReadContractParameters): Promise<ReadContractReturnType>;
    /**
     * Creates a trade.
     *
     * @param options - The options for the trade.
     * @returns The trade.
     */
    createTrade(options: CreateTradeOptions): Promise<Trade>;
    /**
     * Deploys a token.
     *
     * @param options - The options for the token deployment.
     * @returns The deployed token.
     */
    deployToken(options: CreateERC20Options): Promise<SmartContract>;
    /**
     * Deploys a contract.
     *
     * @param options - The options for contract deployment
     * @param options.solidityVersion - The version of the Solidity compiler to use (e.g. "0.8.0+commit.c7dfd78e")
     * @param options.solidityInputJson - The JSON input for the Solidity compiler containing contract source and settings
     * @param options.contractName - The name of the contract to deploy
     * @param options.constructorArgs - Key-value map of constructor args
     *
     * @returns A Promise that resolves to the deployed contract instance
     * @throws Error if wallet is not initialized
     */
    deployContract(options: {
        solidityVersion: string;
        solidityInputJson: string;
        contractName: string;
        constructorArgs: Record<string, unknown>;
    }): Promise<SmartContract>;
    /**
     * Deploys a new NFT (ERC-721) smart contract.
     *
     * @param options - Configuration options for the NFT contract deployment
     * @param options.name - The name of the collection
     * @param options.symbol - The token symbol for the collection
     * @param options.baseURI - The base URI for token metadata.
     *
     * @returns A Promise that resolves to the deployed SmartContract instance
     * @throws Error if the wallet is not properly initialized
     * @throws Error if the deployment fails for any reason (network issues, insufficient funds, etc.)
     */
    deployNFT(options: {
        name: string;
        symbol: string;
        baseURI: string;
    }): Promise<SmartContract>;
    /**
     * Transfer the native asset of the network.
     *
     * @param to - The destination address.
     * @param value - The amount to transfer in Wei.
     * @returns The transaction hash.
     */
    nativeTransfer(to: `0x${string}`, value: string): Promise<`0x${string}`>;
    /**
     * Exports the wallet.
     *
     * @returns The wallet's data.
     */
    exportWallet(): Promise<WalletData>;
}
export {};
