"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOLANA_CLUSTER_ID_BY_NETWORK_ID = exports.SOLANA_NETWORKS = exports.SOLANA_DEVNET_NETWORK = exports.SOLANA_TESTNET_NETWORK = exports.SOLANA_MAINNET_NETWORK = exports.SOLANA_DEVNET_GENESIS_BLOCK_HASH = exports.SOLANA_TESTNET_GENESIS_BLOCK_HASH = exports.SOLANA_MAINNET_GENESIS_BLOCK_HASH = exports.SOLANA_PROTOCOL_FAMILY = exports.SOLANA_DEVNET_NETWORK_ID = exports.SOLANA_TESTNET_NETWORK_ID = exports.SOLANA_MAINNET_NETWORK_ID = void 0;
// CDP Network IDs
exports.SOLANA_MAINNET_NETWORK_ID = "solana-mainnet";
exports.SOLANA_TESTNET_NETWORK_ID = "solana-testnet";
exports.SOLANA_DEVNET_NETWORK_ID = "solana-devnet";
// AgentKit Protocol Family
exports.SOLANA_PROTOCOL_FAMILY = "svm";
// Chain IDs - Genesis Block Hashes
exports.SOLANA_MAINNET_GENESIS_BLOCK_HASH = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d";
exports.SOLANA_TESTNET_GENESIS_BLOCK_HASH = "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY";
exports.SOLANA_DEVNET_GENESIS_BLOCK_HASH = "EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG";
exports.SOLANA_MAINNET_NETWORK = {
    protocolFamily: exports.SOLANA_PROTOCOL_FAMILY,
    chainId: exports.SOLANA_MAINNET_GENESIS_BLOCK_HASH,
    networkId: exports.SOLANA_MAINNET_NETWORK_ID,
};
exports.SOLANA_TESTNET_NETWORK = {
    protocolFamily: exports.SOLANA_PROTOCOL_FAMILY,
    chainId: exports.SOLANA_TESTNET_GENESIS_BLOCK_HASH,
    networkId: exports.SOLANA_TESTNET_NETWORK_ID,
};
exports.SOLANA_DEVNET_NETWORK = {
    protocolFamily: exports.SOLANA_PROTOCOL_FAMILY,
    chainId: exports.SOLANA_DEVNET_GENESIS_BLOCK_HASH,
    networkId: exports.SOLANA_DEVNET_NETWORK_ID,
};
exports.SOLANA_NETWORKS = {
    [exports.SOLANA_MAINNET_GENESIS_BLOCK_HASH]: exports.SOLANA_MAINNET_NETWORK,
    [exports.SOLANA_TESTNET_GENESIS_BLOCK_HASH]: exports.SOLANA_TESTNET_NETWORK,
    [exports.SOLANA_DEVNET_GENESIS_BLOCK_HASH]: exports.SOLANA_DEVNET_NETWORK,
};
exports.SOLANA_CLUSTER_ID_BY_NETWORK_ID = {
    [exports.SOLANA_MAINNET_NETWORK_ID]: "mainnet-beta",
    [exports.SOLANA_TESTNET_NETWORK_ID]: "testnet",
    [exports.SOLANA_DEVNET_NETWORK_ID]: "devnet",
};
