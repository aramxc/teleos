// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AgentMarketplace is Ownable, ReentrancyGuard {
    struct Agent {
        address payable owner;
        uint256 price;
        bool isActive;
    }
    
    mapping(string => Agent) public agents; // agentId -> Agent
    
    event AgentRegistered(string agentId, address owner, uint256 price);
    event AgentPurchased(string agentId, address buyer, uint256 amount);
    
    address payable public constant DEMO_WALLET = payable(0x8E1de3b958434dBb3a0fd53D3413A6A0c0C263F1);
    
    constructor() Ownable(msg.sender) {}
    
    function registerAgent(
        string memory agentId, 
        uint256 price,
        address payable ownerAddress
    ) external {
        require(agents[agentId].owner == address(0), "Agent already registered");
        // if ownerAddress is not set, use the demo wallet
        address payable actualOwner = ownerAddress == address(0) ? DEMO_WALLET : ownerAddress;
        
        agents[agentId] = Agent({
            owner: actualOwner,
            price: price,
            isActive: true
        });
        
        emit AgentRegistered(agentId, actualOwner, price);
    }
    
    function purchaseAgent(string memory agentId) external payable nonReentrant {
        Agent storage agent = agents[agentId];
        require(agent.isActive, "Agent is not active");
        require(msg.value == agent.price, "Incorrect payment amount");
        
        if (msg.value > 0) {
            (bool success, ) = agent.owner.call{value: msg.value}("");
            require(success, "Transfer failed");
        }
        
        emit AgentPurchased(agentId, msg.sender, msg.value);
    }
    
    function updateAgentPrice(string memory agentId, uint256 newPrice) external {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        agents[agentId].price = newPrice;
    }
    
    function toggleAgentStatus(string memory agentId) external {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        agents[agentId].isActive = !agents[agentId].isActive;
    }
    
    function bulkSetAgentStatus(string[] memory agentIds, bool status) external onlyOwner {
        for(uint i = 0; i < agentIds.length; i++) {
            agents[agentIds[i]].isActive = status;
        }
    }

    function setAgentOwner(string memory agentId, address newOwner) public {
    Agent storage agent = agents[agentId];
    agent.owner = payable(newOwner);
    }
    
}