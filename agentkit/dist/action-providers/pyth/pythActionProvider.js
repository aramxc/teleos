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
exports.pythActionProvider = exports.PythActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
/**
 * PythActionProvider is an action provider for Pyth.
 */
class PythActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Constructs a new PythActionProvider.
     */
    constructor() {
        super("pyth", []);
        /**
         * Checks if the Pyth action provider supports the given network.
         *
         * @returns True if the Pyth action provider supports the network, false otherwise.
         */
        this.supportsNetwork = () => true;
    }
    /**
     * Fetch the price feed ID for a given token symbol from Pyth.
     *
     * @param args - The arguments for the action.
     * @returns The price feed ID as a string.
     */
    async fetchPriceFeed(args) {
        const url = `https://hermes.pyth.network/v2/price_feeds?query=${args.tokenSymbol}&asset_type=crypto`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.length === 0) {
            throw new Error(`No price feed found for ${args.tokenSymbol}`);
        }
        const filteredData = data.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item) => item.attributes.base.toLowerCase() === args.tokenSymbol.toLowerCase());
        if (filteredData.length === 0) {
            throw new Error(`No price feed found for ${args.tokenSymbol}`);
        }
        return filteredData[0].id;
    }
    /**
     * Fetches the price from Pyth given a Pyth price feed ID.
     *
     * @param args - The arguments for the action.
     * @returns The price as a string.
     */
    async fetchPrice(args) {
        const url = `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${args.priceFeedID}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const parsedData = data.parsed;
        if (parsedData.length === 0) {
            throw new Error(`No price data found for ${args.priceFeedID}`);
        }
        const priceInfo = parsedData[0].price;
        const price = BigInt(priceInfo.price);
        const exponent = priceInfo.expo;
        if (exponent < 0) {
            const adjustedPrice = price * BigInt(100);
            const divisor = BigInt(10) ** BigInt(-exponent);
            const scaledPrice = adjustedPrice / BigInt(divisor);
            const priceStr = scaledPrice.toString();
            const formattedPrice = `${priceStr.slice(0, -2)}.${priceStr.slice(-2)}`;
            return formattedPrice.startsWith(".") ? `0${formattedPrice}` : formattedPrice;
        }
        const scaledPrice = price / BigInt(10) ** BigInt(exponent);
        return scaledPrice.toString();
    }
}
exports.PythActionProvider = PythActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "fetch_price_feed",
        description: "Fetch the price feed ID for a given token symbol from Pyth.",
        schema: schemas_1.PythFetchPriceFeedIDSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], PythActionProvider.prototype, "fetchPriceFeed", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "fetch_price",
        description: `Fetch the price of a given price feed from Pyth.

Inputs:
- Pyth price feed ID

Important notes:
- Do not assume that a random ID is a Pyth price feed ID. If you are confused, ask a clarifying question.
- This action only fetches price inputs from Pyth price feeds. No other source.
- If you are asked to fetch the price from Pyth for a ticker symbol such as BTC, you must first use the pyth_fetch_price_feed_id
action to retrieve the price feed ID before invoking the pyth_Fetch_price action
`,
        schema: schemas_1.PythFetchPriceSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], PythActionProvider.prototype, "fetchPrice", null);
const pythActionProvider = () => new PythActionProvider();
exports.pythActionProvider = pythActionProvider;
