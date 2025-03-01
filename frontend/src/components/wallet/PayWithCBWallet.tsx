import { Button } from '@mui/material';
import { useWallet } from '@/contexts/WalletContext';
import { useSmartContracts } from '@/hooks/useSmartContracts';

interface PayWithCBWalletProps {
  agentId: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function PayWithCBWallet({ 
  agentId,
  onSuccess, 
  onError 
}: PayWithCBWalletProps) {
  const { address, connectWallet } = useWallet();
  const { purchaseAgent, getContracts } = useSmartContracts();

  const handlePayment = async () => {
    try {
      if (!address) {
        await connectWallet();
        return;
      }

      // First get the contract instance
      const { marketplaceContract } = await getContracts();
      
      // Get the agent details from the contract
      const agentDetails = await marketplaceContract.agents(agentId);
      
      // Verify the agent is active and has a valid price
      if (!agentDetails.isActive) {
        throw new Error('Agent is not active');
      }

      const receipt = await purchaseAgent(agentId);
      onSuccess?.(receipt.transactionHash);
      return receipt.transactionHash;
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