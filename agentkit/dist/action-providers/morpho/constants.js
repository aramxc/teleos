"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METAMORPHO_ABI = exports.MORPHO_BASE_ADDRESS = void 0;
exports.MORPHO_BASE_ADDRESS = "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb";
exports.METAMORPHO_ABI = [
    {
        inputs: [
            { internalType: "uint256", name: "assets", type: "uint256" },
            { internalType: "address", name: "receiver", type: "address" },
        ],
        name: "deposit",
        outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "assets", type: "uint256" },
            { internalType: "address", name: "receiver", type: "address" },
            { internalType: "address", name: "owner", type: "address" },
        ],
        name: "withdraw",
        outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];
