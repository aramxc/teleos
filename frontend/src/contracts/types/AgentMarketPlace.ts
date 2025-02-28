import { ethers } from 'ethers';
import AgentMarketplaceAbi from '../abis/AgentMarketplace.json';
import { AGENT_MARKETPLACE_ADDRESS } from '../addresses/contracts';

export const getAgentMarketplaceContract = (
  provider: ethers.Provider,
  network: keyof typeof AGENT_MARKETPLACE_ADDRESS
) => {
  return new ethers.Contract(
    AGENT_MARKETPLACE_ADDRESS[network],
    AgentMarketplaceAbi,
    provider
  );
};