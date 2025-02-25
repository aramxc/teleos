"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const basenameActionProvider_1 = require("./basenameActionProvider");
const constants_1 = require("./constants");
const schemas_1 = require("./schemas");
const coinbase_sdk_1 = require("@coinbase/coinbase-sdk");
const MOCK_AMOUNT = "0.123";
const MOCK_BASENAME = "test-basename";
describe("Register Basename Input", () => {
    it("should successfully parse valid input", () => {
        const validInput = {
            amount: MOCK_AMOUNT,
            basename: MOCK_BASENAME,
        };
        const result = schemas_1.RegisterBasenameSchema.safeParse(validInput);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validInput);
    });
    it("should fail parsing empty input", () => {
        const emptyInput = {};
        const result = schemas_1.RegisterBasenameSchema.safeParse(emptyInput);
        expect(result.success).toBe(false);
    });
});
describe("Register Basename Action", () => {
    /**
     * This is the default network.
     */
    const NETWORK_ID = coinbase_sdk_1.Coinbase.networks.BaseMainnet;
    /**
     * This is a 40 character hexadecimal string that requires lowercase alpha characters.
     */
    const ADDRESS_ID = "0xe6b2af36b3bb8d47206a129ff11d5a2de2a63c83";
    let mockWallet;
    const actionProvider = (0, basenameActionProvider_1.basenameActionProvider)();
    beforeEach(() => {
        mockWallet = {
            getAddress: jest.fn().mockReturnValue(ADDRESS_ID),
            getNetwork: jest.fn().mockReturnValue({ networkId: NETWORK_ID }),
            sendTransaction: jest.fn(),
            waitForTransactionReceipt: jest.fn(),
        };
        mockWallet.sendTransaction.mockResolvedValue("some-hash");
        mockWallet.waitForTransactionReceipt.mockResolvedValue({});
    });
    it(`should Successfully respond with ${MOCK_BASENAME}.base.eth for network: ${coinbase_sdk_1.Coinbase.networks.BaseMainnet}`, async () => {
        const args = {
            amount: MOCK_AMOUNT,
            basename: MOCK_BASENAME,
        };
        const name = `${MOCK_BASENAME}.base.eth`;
        mockWallet.getNetwork.mockReturnValue({
            protocolFamily: "evm",
            networkId: coinbase_sdk_1.Coinbase.networks.BaseMainnet,
        });
        const response = await actionProvider.register(mockWallet, args);
        expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
            to: constants_1.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_MAINNET,
            data: (0, viem_1.encodeFunctionData)({
                abi: constants_1.REGISTRAR_ABI,
                functionName: "register",
                args: [
                    {
                        name: MOCK_BASENAME,
                        owner: ADDRESS_ID,
                        duration: constants_1.REGISTRATION_DURATION,
                        resolver: constants_1.L2_RESOLVER_ADDRESS_MAINNET,
                        data: [
                            (0, viem_1.encodeFunctionData)({
                                abi: constants_1.L2_RESOLVER_ABI,
                                functionName: "setAddr",
                                args: [(0, viem_1.namehash)(name), ADDRESS_ID],
                            }),
                            (0, viem_1.encodeFunctionData)({
                                abi: constants_1.L2_RESOLVER_ABI,
                                functionName: "setName",
                                args: [(0, viem_1.namehash)(name), name],
                            }),
                        ],
                        reverseRecord: true,
                    },
                ],
            }),
            value: (0, viem_1.parseEther)(MOCK_AMOUNT),
        });
        expect(mockWallet.waitForTransactionReceipt).toHaveBeenCalledWith("some-hash");
        expect(response).toContain(`Successfully registered basename ${MOCK_BASENAME}.base.eth`);
        expect(response).toContain(`for address ${ADDRESS_ID}`);
    });
    it(`should Successfully respond with ${MOCK_BASENAME}.basetest.eth for any other network`, async () => {
        const args = {
            amount: MOCK_AMOUNT,
            basename: MOCK_BASENAME,
        };
        const name = `${MOCK_BASENAME}.basetest.eth`;
        mockWallet.getNetwork.mockReturnValue({
            protocolFamily: "evm",
            networkId: "anything-else",
        });
        const response = await actionProvider.register(mockWallet, args);
        expect(mockWallet.sendTransaction).toHaveBeenCalledWith({
            to: constants_1.BASENAMES_REGISTRAR_CONTROLLER_ADDRESS_TESTNET,
            data: (0, viem_1.encodeFunctionData)({
                abi: constants_1.REGISTRAR_ABI,
                functionName: "register",
                args: [
                    {
                        name: MOCK_BASENAME,
                        owner: ADDRESS_ID,
                        duration: constants_1.REGISTRATION_DURATION,
                        resolver: constants_1.L2_RESOLVER_ADDRESS_TESTNET,
                        data: [
                            (0, viem_1.encodeFunctionData)({
                                abi: constants_1.L2_RESOLVER_ABI,
                                functionName: "setAddr",
                                args: [(0, viem_1.namehash)(name), ADDRESS_ID],
                            }),
                            (0, viem_1.encodeFunctionData)({
                                abi: constants_1.L2_RESOLVER_ABI,
                                functionName: "setName",
                                args: [(0, viem_1.namehash)(name), name],
                            }),
                        ],
                        reverseRecord: true,
                    },
                ],
            }),
            value: (0, viem_1.parseEther)(MOCK_AMOUNT),
        });
        expect(mockWallet.waitForTransactionReceipt).toHaveBeenCalledWith("some-hash");
        expect(response).toContain(`Successfully registered basename ${MOCK_BASENAME}.basetest.eth`);
        expect(response).toContain(`for address ${ADDRESS_ID}`);
    });
    it("should fail with an error", async () => {
        const args = {
            amount: MOCK_AMOUNT,
            basename: MOCK_BASENAME,
        };
        const error = new Error("Failed to register basename");
        mockWallet.sendTransaction.mockRejectedValue(error);
        await actionProvider.register(mockWallet, args);
        expect(mockWallet.sendTransaction).toHaveBeenCalled();
        expect(`Error registering basename: ${error}`);
    });
});
