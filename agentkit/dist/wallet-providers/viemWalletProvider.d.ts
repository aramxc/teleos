import { WalletClient as ViemWalletClient, TransactionRequest, ReadContractParameters, ReadContractReturnType } from "viem";
import { EvmWalletProvider } from "./evmWalletProvider";
import { Network } from "../network";
/**
 * Configuration for gas multipliers.
 */
export interface ViemWalletProviderGasConfig {
    /**
     * An internal multiplier on gas limit estimation.
     */
    gasLimitMultiplier?: number;
    /**
     * An internal multiplier on fee per gas estimation.
     */
    feePerGasMultiplier?: number;
}
/**
 * A wallet provider that uses the Viem library.
 */
export declare class ViemWalletProvider extends EvmWalletProvider {
    #private;
    /**
     * Constructs a new ViemWalletProvider.
     *
     * @param walletClient - The wallet client.
     * @param gasConfig - Configuration for gas multipliers.
     */
    constructor(walletClient: ViemWalletClient, gasConfig?: ViemWalletProviderGasConfig);
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
     * @returns The balance of the wallet.
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
     * Transfer the native asset of the network.
     *
     * @param to - The destination address.
     * @param value - The amount to transfer in whole units (e.g. ETH)
     * @returns The transaction hash.
     */
    nativeTransfer(to: `0x${string}`, value: string): Promise<`0x${string}`>;
}
