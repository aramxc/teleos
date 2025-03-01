import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const AgentMarketplace = await ethers.getContractFactory("AgentMarketplace");
  console.log("Deploying AgentMarketplace...");
  
  const marketplace = await AgentMarketplace.deploy();
  await marketplace.waitForDeployment();

  const marketplaceAddress = await marketplace.getAddress();
  console.log("AgentMarketplace deployed to:", marketplaceAddress);
  console.log("\nView contract on Base Sepolia Explorer:");
  console.log(`https://sepolia.basescan.org/address/${marketplaceAddress}`);

  // Save the contract address
  const fs = require('fs');
  const path = require('path');
  const addressesPath = path.join(__dirname, '../../frontend/src/contracts/addresses/contracts.ts');
  
  const addressContent = `
export const AGENT_MARKETPLACE_ADDRESS = {
  baseSepolia: "${process.env.HARDHAT_NETWORK === 'baseSepolia' ? marketplaceAddress : ''}",
  localhost: "${process.env.HARDHAT_NETWORK === 'localhost' ? marketplaceAddress : ''}"
} as const;
`;

  fs.writeFileSync(addressesPath, addressContent);
  console.log("Contract address saved to frontend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });