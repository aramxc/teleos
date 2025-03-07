# Teleos AI

> *From the greek work Telos meaning "end", "purpose", or "goal"* 

An intuitive, mobile-friendly, LLM interface allowing users to seamlessly purchase AI agents and perform other meaningful actions onchain. This project was conceptualized and *mostly* built out within 5 days for ETH Denver's Buildathon in 2025. The project eventually went on to get top 10 out of nearly 200 projects submitted, in the Infrastructure and Scalability category.

## Key Features of MVP
- [ ] Seamless integration with popular LLMs and agent frameorks for reasoning and decision making
- [ ] Ability to execute complex transactions with natural language onchain
- [ ] Ability to upload custom agents that can be instantly paid for andused by non-technical users
- [ ] Fully responsive, mobile-first design
- [ ] Ask the agent to display a list of AI agents for a specfic use case or category and see a detailed list of agents to choose from
## Stack
- [ ] LLMs: OpenAI, Anthropic, ElizaOS
- [ ] Backend/Datanase: Supabase for database, storage, and auth
- [ ] Frontend: React, NextJS, TailwindCSS, MUI
- [ ] Smart Contracts: Solidity, OpenZeppelin
- [ ] Onchain Interactions: Web3.js, ethers.js, Coinbase Wallet SDK, AgentKit
- [ ] Hosting: Vercel

## Smart Contract / Onchain Interactions
- [ ] Using Base Sepolia for testing and verifying key functionality
- [ ] A user can complete the upload form by providing a wallet address, tags, and a description of the agent among other details, and the agent is then registered onchain:

```solidity
function registerAgent(
    string memory agentId, 
    uint256 price,
    address payable ownerAddress
) external {
    // Input validation
    require(bytes(agentId).length > 0, "Agent ID cannot be empty");
    require(ownerAddress != address(0), "Invalid owner address");
    require(price > 0, "Price must be greater than 0");
    
    // Check if agent doesn't already exist
    require(agents[agentId].owner == address(0), "Agent already registered");
    
    // Create new agent
    agents[agentId] = Agent({
        owner: ownerAddress,  // Using ownerAddress instead of undefined actualOwner
        price: price,
        isActive: true
    });
    
    emit AgentRegistered(agentId, ownerAddress, price);
}
```

- [ ] A user can then purchase an agent which verifies the agent is registered on Base Sepolia and then pays the agent's wallet directly:

```solidity
function purchaseAgent(string memory agentId) external payable nonReentrant {
    // Check if agent exists
    require(agents[agentId].owner != address(0), "Agent does not exist");
    
    Agent storage agent = agents[agentId];
    require(agent.isActive, "Agent is not active");
    require(msg.value == agent.price, "Incorrect payment amount");
    require(msg.sender != agent.owner, "Owner cannot purchase their own agent");
    
    // Cache the owner address before transfer to prevent reentrancy
    address payable ownerAddress = agent.owner;
    
    // Transfer payment to agent owner
    (bool success, ) = ownerAddress.call{value: msg.value}("");
    require(success, "Transfer failed");
    
    emit AgentPurchased(agentId, msg.sender, msg.value);
}
```

## Ultimate Vision

We initially wanted to have this application be able to kick off an automated workflow of an agent or swarm of agentsusing LangGraph, but quickly approached the project deadline and what you see here is the MVP we were able to build out and have fully functional by the time we presented. In a perfect world, a user could ask to see a list of say, Twitter Social Media Marketing agents, pick one that suits their needs, confirm deliverables, and then pay using the smart contract. A workflow would then be initialized using LangGraph and the user could see in real time the status of the workflow, perhaps allowing real time collaborations with the agent.

For example, during orchestration, the agent could display to the user a list of curated AI generated photos for the marketing campaign and ask in real-time for the user to confirm which photos they would like to use before proceeding with the actual posting. We also considered the idea of creating an Escrow Smart Contract to allow the user to pay the agent in a more secure manner, only releasing funds to the agent after the user is satisfied with the output.





