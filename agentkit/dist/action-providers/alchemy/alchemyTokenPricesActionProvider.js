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
exports.alchemyTokenPricesActionProvider = exports.AlchemyTokenPricesActionProvider = void 0;
const zod_1 = require("zod");
const actionProvider_1 = require("../actionProvider");
const actionDecorator_1 = require("../actionDecorator");
const schemas_1 = require("./schemas");
/**
 * AlchemyTokenPricesActionProvider is an action provider for fetching token prices via the Alchemy Prices API.
 * This provider enables querying current and historical token prices using symbols or addresses.
 *
 */
class AlchemyTokenPricesActionProvider extends actionProvider_1.ActionProvider {
    /**
     * Creates a new instance of AlchemyTokenPricesActionProvider
     *
     * @param config - Configuration options including the API key
     */
    constructor(config = {}) {
        super("alchemyTokenPrices", []);
        /**
         * Checks if the Alchemy Prices action provider supports the given network.
         * Since the API works with multiple networks, this always returns true.
         *
         * @returns Always returns true.
         */
        this.supportsNetwork = () => {
            return true;
        };
        config.apiKey || (config.apiKey = process.env.ALCHEMY_API_KEY);
        if (!config.apiKey) {
            throw new Error("ALCHEMY_API_KEY is not configured.");
        }
        this.apiKey = config.apiKey;
        this.baseUrl = "https://api.g.alchemy.com/prices/v1";
    }
    /**
     * Fetch current token prices for one or more token symbols.
     *
     * @param args - The arguments containing an array of token symbols.
     * @returns A JSON string with the token prices or an error message.
     */
    async tokenPricesBySymbol(args) {
        try {
            // Build query parameters: for each symbol add a separate query parameter
            const params = new URLSearchParams();
            for (const symbol of args.symbols) {
                params.append("symbols", symbol);
            }
            const url = `${this.baseUrl}/${this.apiKey}/tokens/by-symbol?${params.toString()}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return `Successfully fetched token prices by symbol:\n${JSON.stringify(data, null, 2)}`;
        }
        catch (error) {
            return `Error fetching token prices by symbol: ${error}`;
        }
    }
    /**
     * Fetch current token prices for one or more tokens identified by network and address pairs.
     *
     * @param args - The arguments containing an array of token network/address pairs.
     * @returns A JSON string with the token prices or an error message.
     */
    async tokenPricesByAddress(args) {
        try {
            const url = `${this.baseUrl}/${this.apiKey}/tokens/by-address`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(args),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return `Successfully fetched token prices by address:\n${JSON.stringify(data, null, 2)}`;
        }
        catch (error) {
            return `Error fetching token prices by address: ${error}`;
        }
    }
}
exports.AlchemyTokenPricesActionProvider = AlchemyTokenPricesActionProvider;
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "token_prices_by_symbol",
        description: `
This tool will fetch current prices for one or more tokens using their symbols via the Alchemy Prices API.

A successful response will return a JSON payload similar to:
{
  "data": [
    {
      "symbol": "ETH",
      "prices": [
        {
          "currency": "usd",
          "value": "2873.490923459",
          "lastUpdatedAt": "2025-02-03T23:46:40Z"
        }
      ]
    }
  ]
}

A failure response will return an error message with details.
    `,
        schema: schemas_1.AlchemyTokenPricesBySymbolSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], AlchemyTokenPricesActionProvider.prototype, "tokenPricesBySymbol", null);
__decorate([
    (0, actionDecorator_1.CreateAction)({
        name: "token_prices_by_address",
        description: `
This tool will fetch current prices for tokens using network and address pairs via the Alchemy Prices API.

A successful response will return a JSON payload similar to:
{
  "data": [
    {
      "network": "eth-mainnet",
      "address": "0xYourTokenAddress",
      "prices": [
        {
          "currency": "usd",
          "value": "1234.56",
          "lastUpdatedAt": "2025-02-03T23:46:40Z"
        }
      ]
    }
  ]
}

A failure response will return an error message with details.
    `,
        schema: schemas_1.AlchemyTokenPricesByAddressSchema,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [void 0]),
    __metadata("design:returntype", Promise)
], AlchemyTokenPricesActionProvider.prototype, "tokenPricesByAddress", null);
/**
 * Factory function to create a new AlchemyTokenPricesActionProvider instance.
 *
 * @param config - The configuration options for the provider.
 * @returns A new instance of AlchemyTokenPricesActionProvider.
 */
const alchemyTokenPricesActionProvider = (config) => new AlchemyTokenPricesActionProvider(config);
exports.alchemyTokenPricesActionProvider = alchemyTokenPricesActionProvider;
