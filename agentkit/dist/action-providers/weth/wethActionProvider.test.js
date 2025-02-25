"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("./schemas");
const viem_1 = require("viem");
const constants_1 = require("./constants");
const wethActionProvider_1 = require("./wethActionProvider");
const MOCK_AMOUNT = "15";
const MOCK_ADDRESS = "0x1234567890123456789012345678901234543210";
describe("Wrap Eth Schema", () => {
    it("should successfully parse valid input", () => {
        const validInput = {
            amountToWrap: MOCK_AMOUNT,
        };
        const result = schemas_1.WrapEthSchema.safeParse(validInput);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validInput);
    });
    it("should fail parsing empty input", () => {
        const emptyInput = {};
        const result = schemas_1.WrapEthSchema.safeParse(emptyInput);
        expect(result.success).toBe(false);
    });
});
describe("Wrap Eth Action", () => {
    let mockWallet;
    const actionProvider = (0, wethActionProvider_1.wethActionProvider)();
    beforeEach(async () => {
        mockWallet = {
            getAddress: jest.fn().mockReturnValue(MOCK_ADDRESS),
            sendTransaction: jest.fn(),
            waitForTransactionReceipt: jest.fn(),
        };
    });
    it("should successfully respond", async () => {
        const args = {
            amountToWrap: MOCK_AMOUNT,
        };
        const hash = "0x1234567890123456789012345678901234567890";
        mockWallet.sendTransaction.mockResolvedValue(hash);
        const response = await actionProvider.wrapEth(mockWallet, args);
        expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
            to: constants_1.WETH_ADDRESS,
            data: (0, viem_1.encodeFunctionData)({
                abi: constants_1.WETH_ABI,
                functionName: "deposit",
            }),
            value: BigInt(MOCK_AMOUNT),
        });
        expect(response).toContain(`Wrapped ETH with transaction hash: ${hash}`);
    });
    it("should fail with an error", async () => {
        const args = {
            amountToWrap: MOCK_AMOUNT,
        };
        const error = new Error("Failed to wrap ETH");
        mockWallet.sendTransaction.mockRejectedValue(error);
        const response = await actionProvider.wrapEth(mockWallet, args);
        expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
            to: constants_1.WETH_ADDRESS,
            data: (0, viem_1.encodeFunctionData)({
                abi: constants_1.WETH_ABI,
                functionName: "deposit",
            }),
            value: BigInt(MOCK_AMOUNT),
        });
        expect(response).toContain(`Error wrapping ETH: ${error}`);
    });
});
describe("supportsNetwork", () => {
    const actionProvider = (0, wethActionProvider_1.wethActionProvider)();
    it("should return true for base-mainnet", () => {
        const result = actionProvider.supportsNetwork({
            protocolFamily: "evm",
            networkId: "base-mainnet",
        });
        expect(result).toBe(true);
    });
    it("should return true for base-sepolia", () => {
        const result = actionProvider.supportsNetwork({
            protocolFamily: "evm",
            networkId: "base-sepolia",
        });
        expect(result).toBe(true);
    });
    it("should return false for non-base networks", () => {
        const result = actionProvider.supportsNetwork({
            protocolFamily: "evm",
            networkId: "ethereum-mainnet",
        });
        expect(result).toBe(false);
    });
});
