// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AgentMarketplace is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    
    struct Agent {
        address payable owner;
        uint256 price;
        bool isActive;
    }
    
    mapping(string => Agent) public agents; // agentId -> Agent
    
    event AgentRegistered(string agentId, address owner, uint256 price);
    event AgentPurchased(string agentId, address buyer, uint256 amount);
    
    constructor(address _usdcAddress) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcAddress);
    }
    
    function registerAgent(string memory agentId, uint256 price) external {
        require(agents[agentId].owner == address(0), "Agent already registered");
        
        agents[agentId] = Agent({
            owner: payable(msg.sender),
            price: price,
            isActive: true
        });
        
        emit AgentRegistered(agentId, msg.sender, price);
    }
    
    function purchaseAgent(string memory agentId) external nonReentrant {
        Agent storage agent = agents[agentId];
        require(agent.isActive, "Agent not active");
        
        uint256 price = agent.price;
        address payable owner = agent.owner;
        
        require(usdcToken.transferFrom(msg.sender, owner, price), "Payment failed");
        
        emit AgentPurchased(agentId, msg.sender, price);
    }
    
    function updateAgentPrice(string memory agentId, uint256 newPrice) external {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        agents[agentId].price = newPrice;
    }
    
    function toggleAgentStatus(string memory agentId) external {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        agents[agentId].isActive = !agents[agentId].isActive;
    }
}