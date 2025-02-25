"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const erc20ActionProvider_1 = require("./erc20ActionProvider");
const schemas_1 = require("./schemas");
const viem_1 = require("viem");
const constants_1 = require("./constants");
const MOCK_AMOUNT = 15;
const MOCK_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
const MOCK_DESTINATION = "0x9876543210987654321098765432109876543210";
const MOCK_ADDRESS = "0x1234567890123456789012345678901234567890";
describe("Transfer Schema", () => {
    it("should successfully parse valid input", () => {
        const validInput = {
            amount: MOCK_AMOUNT,
            contractAddress: MOCK_CONTRACT_ADDRESS,
            destination: MOCK_DESTINATION,
        };
        const result = schemas_1.TransferSchema.safeParse(validInput);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validInput);
    });
    it("should fail parsing empty input", () => {
        const emptyInput = {};
        const result = schemas_1.TransferSchema.safeParse(emptyInput);
        expect(result.success).toBe(false);
    });
});
describe("Get Balance Action", () => {
    let mockWallet;
    const actionProvider = (0, erc20ActionProvider_1.erc20ActionProvider)();
    beforeEach(async () => {
        mockWallet = {
            getAddress: jest.fn().mockReturnValue(MOCK_ADDRESS),
            readContract: jest.fn(),
        };
        mockWallet.readContract.mockResolvedValue(MOCK_AMOUNT);
    });
    it("should successfully respond", async () => {
        const args = {
            contractAddress: MOCK_CONTRACT_ADDRESS,
        };
        const response = await actionProvider.getBalance(mockWallet, args);
        expect(mockWallet.readContract).toHaveBeenCalledWith({
            address: args.contractAddress,
            abi: constants_1.abi,
            functionName: "balanceOf",
            args: [mockWallet.getAddress()],
        });
        expect(response).toContain(`Balance of ${MOCK_CONTRACT_ADDRESS} is ${MOCK_AMOUNT}`);
    });
    it("should fail with an error", async () => {
        const args = {
            contractAddress: MOCK_CONTRACT_ADDRESS,
        };
        const error = new Error("Failed to get balance");
        mockWallet.readContract.mockRejectedValue(error);
        const response = await actionProvider.getBalance(mockWallet, args);
        expect(mockWallet.readContract).toHaveBeenCalledWith({
            address: args.contractAddress,
            abi: constants_1.abi,
            functionName: "balanceOf",
            args: [mockWallet.getAddress()],
        });
        expect(response).toContain(`Error getting balance: ${error}`);
    });
});
describe("Transfer Action", () => {
    const TRANSACTION_HASH = "0xghijkl987654321";
    let mockWallet;
    const actionProvider = (0, erc20ActionProvider_1.erc20ActionProvider)();
    beforeEach(async () => {
        mockWallet = {
            sendTransaction: jest.fn(),
            waitForTransactionReceipt: jest.fn(),
        };
        mockWallet.sendTransaction.mockResolvedValue(TRANSACTION_HASH);
        mockWallet.waitForTransactionReceipt.mockResolvedValue({});
    });
    it("should successfully respond", async () => {
        const args = {
            amount: BigInt(MOCK_AMOUNT),
            contractAddress: MOCK_CONTRACT_ADDRESS,
            destination: MOCK_DESTINATION,
        };
        const response = await actionProvider.transfer(mockWallet, args);
        expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
            to: args.contractAddress,
            data: (0, viem_1.encodeFunctionData)({
                abi: constants_1.abi,
                functionName: "transfer",
                args: [args.destination, BigInt(args.amount)],
            }),
        });
        expect(mockWallet.waitForTransactionReceipt).toHaveBeenCalledWith(TRANSACTION_HASH);
        expect(response).toContain(`Transferred ${MOCK_AMOUNT} of ${MOCK_CONTRACT_ADDRESS} to ${MOCK_DESTINATION}`);
        expect(response).toContain(`Transaction hash for the transfer: ${TRANSACTION_HASH}`);
    });
    it("should fail with an error", async () => {
        const args = {
            amount: BigInt(MOCK_AMOUNT),
            contractAddress: MOCK_CONTRACT_ADDRESS,
            destination: MOCK_DESTINATION,
        };
        const error = new Error("Failed to execute transfer");
        mockWallet.sendTransaction.mockRejectedValue(error);
        const response = await actionProvider.transfer(mockWallet, args);
        expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
            to: args.contractAddress,
            data: (0, viem_1.encodeFunctionData)({
                abi: constants_1.abi,
                functionName: "transfer",
                args: [args.destination, BigInt(args.amount)],
            }),
        });
        expect(response).toContain(`Error transferring the asset: ${error}`);
    });
    describe("supportsNetwork", () => {
        it("should return true when protocolFamily is evm", () => {
            expect(actionProvider.supportsNetwork({ protocolFamily: "evm" })).toBe(true);
        });
        it("should return false when protocolFamily is not evm", () => {
            expect(actionProvider.supportsNetwork({ protocolFamily: "solana" })).toBe(false);
        });
    });
});
