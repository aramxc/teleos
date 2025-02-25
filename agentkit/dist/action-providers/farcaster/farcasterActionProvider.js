"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.farcasterActionProvider = exports.FarcasterActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
/**
 * FarcasterActionProvider is an action provider for Farcaster.
 */
class FarcasterActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructor for the FarcasterActionProvider class.
     *
     * @param config - The configuration options for the FarcasterActionProvider.
     */
    constructor(config = {}) {
        super("farcaster", []);
        /**
         * Checks if the Farcaster action provider supports the given network.
         *
         * @param network - The network to check.
         * @returns True if the Farcaster action provider supports the network, false otherwise.
         */
        this.supportsNetwork = (network) => network.protocolFamily === "evm";
        const neynarApiKey = config.neynarApiKey || process.env.NEYNAR_API_KEY;
        const signerUuid = config.signerUuid || process.env.NEYNAR_MANAGER_SIGNER;
        const agentFid = config.agentFid || process.env.AGENT_FID;
        if (!neynarApiKey) {
            throw new Error("NEYNAR_API_KEY is not configured.");
        }
        if (!signerUuid) {
            throw new Error("NEYNAR_MANAGER_SIGNER is not configured.");
        }
        if (!agentFid) {
            throw new Error("AGENT_FID is not configured.");
        }
        this.neynarApiKey = neynarApiKey;
        this.signerUuid = signerUuid;
        this.agentFid = agentFid;
    }
    /**
     * Retrieves agent's Farcaster account details.
     *
     * @param _ - The input arguments for the action.
     * @returns A message containing account details for the agent's Farcaster account.
     */
    async accountDetails(_) {
        try {
            const headers = {
                accept: "application/json",
                "x-api-key": this.neynarApiKey,
                "x-neynar-experimental": "true",
            };
            const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${this.agentFid}`, {
                method: "GET",
                headers,
            });
            const { users } = await response.json();
            return `Successfully retrieved Farcaster account details:\n${JSON.stringify(users[0])}`;
        }
        catch (error) {
            return `Error retrieving Farcaster account details:\n${error}`;
        }
    }
    /**
     * Posts a cast on Farcaster.
     *
     * @param args - The input arguments for the action.
     * @returns A message indicating the success or failure of the cast posting.
     */
    async postCast(args) {
        try {
            const headers = {
                api_key: this.neynarApiKey,
                "Content-Type": "application/json",
            };
            const response = await fetch("https://api.neynar.com/v2/farcaster/cast", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    signer_uuid: this.signerUuid,
                    text: args.castText,
                }),
            });
            const data = await response.json();
            return `Successfully posted cast to Farcaster:\n${JSON.stringify(data)}`;
        }
        catch (error) {
            return `Error posting to Farcaster:\n${error}`;
        }
    }
}
exports.FarcasterActionProvider = FarcasterActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "account_details",
        description: `
This tool will retrieve the account details for the agent's Farcaster account.
The tool takes the FID of the agent's account.

A successful response will return a message with the API response as a JSON payload:
    { "object": "user", "fid": 193," username": "derek", "display_name": "Derek", ... }

A failure response will return a message with the Farcaster API request error:
    Unable to retrieve account details.
`,
        schema: schemas_1.FarcasterAccountDetailsSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], FarcasterActionProvider.prototype, "accountDetails", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "post_cast",
        description: `
This tool will post a cast to Farcaster. The tool takes the text of the cast as input. Casts can be maximum 280 characters.

A successful response will return a message with the API response as a JSON payload:
    {}

A failure response will return a message with the Farcaster API request error:
    You are not allowed to post a cast with duplicate content.
`,
        schema: schemas_1.FarcasterPostCastSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], FarcasterActionProvider.prototype, "postCast", null);
const farcasterActionProvider = (config = {}) => new FarcasterActionProvider(config);
exports.farcasterActionProvider = farcasterActionProvider;
