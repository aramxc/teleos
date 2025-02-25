"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WETH_ABI = exports.WETH_ADDRESS = void 0;
exports.WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
exports.WETH_ABI = [
    {
        inputs: [],
        name: "deposit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                name: "account",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
