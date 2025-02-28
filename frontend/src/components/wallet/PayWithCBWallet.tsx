import { Button } from '@mui/material';
import { useWallet } from '@/contexts/WalletContext';
import { coinbaseProvider } from '@/lib/coinbaseWallet';
import { ethers } from 'ethers';
import { getAgentMarketplaceContract } from '@/contracts/types/AgentMarketPlace';
import { AGENT_MARKETPLACE_ADDRESS } from '@/contracts/addresses/contracts';

interface PayWithCBWalletProps {
  amount: number;
  agentId: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function PayWithCBWallet({ 
  amount, 
  agentId,
  onSuccess, 
  onError 
}: PayWithCBWalletProps) {
  const { address, connectWallet } = useWallet();

  const handlePayment = async () => {
    try {
      if (!address) {
        await connectWallet();
        return;
      }

      // Get contract instance
      const network = process.env.NODE_ENV === 'development' ? 'localhost' : 'baseSepolia';
      const ethersProvider = new ethers.BrowserProvider(coinbaseProvider);
      const contract = getAgentMarketplaceContract(ethersProvider, network);

      // First approve USDC spending
      const usdcAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
      const amountInWei = BigInt(amount * 1_000_000).toString();

      // USDC approve function
      const usdcContract = new ethers.Contract(
        usdcAddress,
        ['function approve(address spender, uint256 amount) returns (bool)'],
        ethersProvider
      );

      // Approve marketplace contract to spend USDC
      const approveTx = await usdcContract.approve(
        AGENT_MARKETPLACE_ADDRESS[network],
        amountInWei
      );
      await approveTx.wait();

      // Purchase agent through marketplace
      const purchaseTx = await contract.purchaseAgent(agentId);
      const receipt = await purchaseTx.wait();

      const txHash = receipt.transactionHash;
      
      // Base Sepolia block explorer URL
      const explorerUrl = `https://sepolia.basescan.org/tx/${txHash}`;
      console.log('Transaction submitted:', explorerUrl);

      onSuccess?.(txHash);
      return txHash;
    } catch (error) {
      console.error('Payment failed:', error);
      onError?.(error instanceof Error ? error : new Error('Payment failed'));
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handlePayment}
      className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
    >
      {address ? 'Pay Now' : 'Connect Wallet'}
    </Button>
  );
}