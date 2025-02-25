"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChain = exports.NETWORK_ID_TO_VIEM_CHAIN = exports.NETWORK_ID_TO_CHAIN_ID = exports.CHAIN_ID_TO_NETWORK_ID = void 0;
const chains_1 = require("viem/chains");
const chains = __importStar(require("viem/chains"));
/**
 * Maps EVM chain IDs to Coinbase network IDs
 */
exports.CHAIN_ID_TO_NETWORK_ID = {
    1: "ethereum-mainnet",
    11155111: "ethereum-sepolia",
    137: "polygon-mainnet",
    80001: "polygon-mumbai",
    8453: "base-mainnet",
    84532: "base-sepolia",
    42161: "arbitrum-mainnet",
    421614: "arbitrum-sepolia",
    10: "optimism-mainnet",
    11155420: "optimism-sepolia",
};
/**
 * Maps Coinbase network IDs to EVM chain IDs
 */
exports.NETWORK_ID_TO_CHAIN_ID = Object.entries(exports.CHAIN_ID_TO_NETWORK_ID).reduce((acc, [chainId, networkId]) => {
    acc[networkId] = String(chainId);
    return acc;
}, {});
/**
 * Maps Coinbase network IDs to Viem chain objects
 */
exports.NETWORK_ID_TO_VIEM_CHAIN = {
    "ethereum-mainnet": chains_1.mainnet,
    "ethereum-sepolia": chains_1.sepolia,
    "polygon-mainnet": chains_1.polygon,
    "polygon-mumbai": chains_1.polygonMumbai,
    "base-mainnet": chains_1.base,
    "base-sepolia": chains_1.baseSepolia,
    "arbitrum-mainnet": chains_1.arbitrum,
    "arbitrum-sepolia": chains_1.arbitrumSepolia,
    "optimism-mainnet": chains_1.optimism,
    "optimism-sepolia": chains_1.optimismSepolia,
};
/**
 * Get a chain from the viem chains object
 *
 * @param id - The chain ID
 * @returns The chain
 */
const getChain = (id) => {
    const chainList = Object.values(chains);
    return chainList.find(chain => chain.id === parseInt(id));
};
exports.getChain = getChain;
