import { ethers } from "ethers";
import AgentMarketPlaceABI from "../abis/AgentMarketPlace.json";
import { AGENT_MARKETPLACE_ADDRESS } from "../addresses/contracts";

export const getAgentMarketplaceContract = async (
  provider: ethers.Provider | ethers.Signer,
  network: keyof typeof AGENT_MARKETPLACE_ADDRESS
) => {
  const contractAddress = AGENT_MARKETPLACE_ADDRESS[network];

  if (!contractAddress) {
    throw new Error(`No contract address for network: ${network}`);
  }

  return new ethers.Contract(contractAddress, AgentMarketPlaceABI, provider);
};

