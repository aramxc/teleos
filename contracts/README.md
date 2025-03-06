# Agent Marketplace Smart Contract

This project contains a smart contract for managing an AI agent marketplace on Base Sepolia. The contract allows users to register, purchase, and manage AI agents.

## Prerequisites

1. Install Node.js (v18+ recommended)
2. Install pnpm: `npm install -g pnpm`
3. Get some Base Sepolia ETH from the [Base Faucet](https://www.base.org/faucet)
4. Create an account on [Alchemy](https://www.alchemy.com/) for RPC access
5. Create an account on [Etherscan](https://etherscan.io/) for contract verification

## Setup

1. Clone the repository and install dependencies:
```bash
pnpm install
```

2. Create a `.env` file in the contracts directory:
```env
# Your wallet private key (from MetaMask)
PRIVATE_KEY=your_private_key_here

# Alchemy API URL for Base Sepolia
BASE_SEPOLIA_RPC_URL=your_alchemy_url_here

# Etherscan API Key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## Contract Overview

The `AgentMarketplace` contract includes the following features:
- Register new agents with prices
- Purchase agents
- Update agent prices
- Toggle agent active status
- Bulk update agent statuses
- Transfer agent ownership

## Contract Deployment and ABI Management

### Understanding the ABI

The ABI (Application Binary Interface) is crucial because:
1. It's like a "manual" that tells applications how to interact with your smart contract
2. It defines all functions, their inputs, and outputs
3. Without it, applications wouldn't know how to call your contract's functions

### Copying the ABI to Frontend

After deploying, you need to copy the contract's ABI to the frontend using the copy-abi script:
```bash
pnpm copy-abi
```

This script:
1. Takes the ABI from `artifacts/contracts/AgentMarketplace.sol/AgentMarketplace.json` (generated AFTER deployment)
2. Copies it to `frontend/src/contracts/abis/AgentMarketplace.json`

### Why This Step is Important

Think of it like this:
- The smart contract is like a vending machine on the blockchain
- The ABI is like the instruction manual for using that vending machine
- Your frontend needs this "manual" to know:
  - What buttons it can press (functions it can call)
  - What coins it needs (input parameters)
  - What products it can get (return values)

### Complete Deployment Flow

1. Compile the contract (creates the ABI):
```bash
pnpm hardhat compile
```

2. Deploy to Base Sepolia:
```bash
pnpm hardhat run scripts/deploy.ts --network baseSepolia
```

3. Copy the ABI to frontend:
```bash
pnpm copy-abi
```

I'd recommend running these steps in sequence (check the main package.json for the commands) but you can also run them separately.

After these steps, your frontend code can interact with the contract:
```typescript
import AgentMarketPlaceABI from "../abis/AgentMarketPlace.json";
import { AGENT_MARKETPLACE_ADDRESS } from "../addresses/contracts";

const contract = new ethers.Contract(
  AGENT_MARKETPLACE_ADDRESS[network],
  AgentMarketPlaceABI,
  provider
);
```

## Deployment

1. Compile the contract:
```bash
pnpm hardhat compile
```

2. Deploy to Base Sepolia:
```bash
pnpm hardhat run scripts/deploy.ts --network baseSepolia
```

The deployment script will:
- Deploy the contract
- Save the contract address to the frontend
- Output the contract address and explorer link

## Contract Interaction

After deployment, you can interact with the contract using these functions:

```solidity
// Register a new agent
registerAgent(string agentId, uint256 price, address payable ownerAddress)

// Purchase an agent
purchaseAgent(string agentId) // payable function

// Update agent price
updateAgentPrice(string agentId, uint256 newPrice)

// Toggle agent status
toggleAgentStatus(string agentId)

// Bulk update agent status (owner only)
bulkSetAgentStatus(string[] agentIds, bool status)

// Transfer agent ownership
setAgentOwner(string agentId, address newOwner)
```

## Testing

1. Run local tests:
```bash
pnpm hardhat test
```

2. Run on a local network:
```bash
# Start local node
pnpm hardhat node

# Deploy to local network (optional if you want to use the local node, but this is a pain)
pnpm hardhat run scripts/deploy.ts --network localhost

# Deploy to baseSepolia (recommended)
pnpm hardhat run scripts/deploy.ts --network baseSepolia
```

## Networks

The contract is configured for:
- Base Sepolia (testnet)
- Localhost (development)

## Contract Addresses

After deployment, contract addresses are automatically saved to:
```typescript
frontend/src/contracts/addresses/contracts.ts
```

## Security Considerations

The contract includes:
- Reentrancy protection
- Ownership controls
- Payment validation
- Status checks

## Troubleshooting

Common issues:
1. "Nonce too high" - Reset your MetaMask account
2. "Insufficient funds" - Get ETH from Base Sepolia faucet
3. "Contract not verified" - Double-check Etherscan API key

## Resources

- [Base Network Documentation](https://docs.base.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [Base Faucet](https://www.base.org/faucet)

## License

MIT
