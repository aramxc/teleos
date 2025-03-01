import { ethers } from 'ethers';
import { coinbaseProvider } from '@/lib/coinbaseWallet';
import { getAgentMarketplaceContract } from '@/contracts/types/AgentMarketPlace';

export const useSmartContracts = () => {
  const getContracts = async () => {
    if (!coinbaseProvider) throw new Error("Wallet provider not initialized");
    
    const signer = await coinbaseProvider.getSigner();
    const marketplaceContract = await getAgentMarketplaceContract(signer, 'baseSepolia');
    return { marketplaceContract };
  };

  const purchaseAgent = async (agentId: string) => {
    const { marketplaceContract } = await getContracts();
    // We don't need to pass the price since it's stored in the contract
    const purchaseTx = await marketplaceContract.purchaseAgent(agentId);
    return await purchaseTx.wait();
  };

  const registerAgent = async (
    agentId: string, 
    price: number, 
    ownerAddress?: string
  ) => {
    const { marketplaceContract } = await getContracts();
    const priceInUSDC = ethers.parseUnits(price.toString(), 6); // USDC has 6 decimals
    
    const tx = await marketplaceContract.registerAgent(
      agentId, 
      priceInUSDC,
      ownerAddress || ethers.ZeroAddress // If no address provided, contract will use DEMO_WALLET
    );
    return await tx.wait();
  };

  const updatePrice = async (agentId: string, newPrice: number) => {
    const { marketplaceContract } = await getContracts();
    const priceInUSDC = ethers.parseUnits(newPrice.toString(), 6); // USDC has 6 decimals
    const tx = await marketplaceContract.updateAgentPrice(agentId, priceInUSDC);
    return await tx.wait();
  };

  return {
    purchaseAgent,
    registerAgent,
    getContracts,
    updatePrice
  };
};