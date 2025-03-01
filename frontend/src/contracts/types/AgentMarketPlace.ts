import { ethers } from 'ethers';
import AgentMarketplaceAbi from '../abis/AgentMarketplace.json';
import { AGENT_MARKETPLACE_ADDRESS } from '../addresses/contracts';

export const getAgentMarketplaceContract = (
  provider: ethers.Provider | ethers.Signer,
  network: keyof typeof AGENT_MARKETPLACE_ADDRESS
) => {
  // If we received a Provider, try to get the signer
  let signer: ethers.Signer | null = null;
  if ('getSigner' in provider) {
    try {
      signer = provider.getSigner();
    } catch (error) {
      console.warn('Could not get signer from provider:', error);
    }
  }

  return new ethers.Contract(
    AGENT_MARKETPLACE_ADDRESS[network],
    AgentMarketplaceAbi,
    signer || provider
  );
};