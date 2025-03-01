import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import { resolve } from "path";

// Load .env from root directory
dotenv.config({ path: resolve(__dirname, "../.env") });

const PRIVATE_KEY = process.env.DEPLOYMENT_WALLET_PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error("DEPLOYMENT_WALLET_PRIVATE_KEY not set in environment");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84532,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;