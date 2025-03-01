import { ethers } from 'ethers';
import { Button, CircularProgress } from '@mui/material';
import { useSmartContracts } from '@/hooks/useSmartContracts';
import { coinbaseProvider } from '@/lib/coinbaseWallet';
import { useState, useEffect } from 'react';

interface PayWithCBWalletProps {
  agentId: string;
  amount: number;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export function PayWithCBWallet({ 
  agentId,
  amount,
  onSuccess, 
  onError,
  onClose 
}: PayWithCBWalletProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getContracts, registerAgent } = useSmartContracts();

  useEffect(() => {
    // Check if already connected
    coinbaseProvider?.send('eth_accounts', [])
      .then((accounts: string[]) => {
        if (accounts[0]) {
          setAddress(accounts[0]);
        }
      })
      .catch(console.error);
  }, []);

  const connectWallet = async () => {
    try {
      if (!coinbaseProvider) throw new Error('Wallet provider not initialized');
      const accounts = await coinbaseProvider.send('eth_requestAccounts', []) as string[];
      if (accounts[0]) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to connect wallet'));
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (!address) {
        await connectWallet();
        setLoading(false);
        return;
      }

      const finalAgentId = agentId || `agent-${Date.now()}`;
      const contracts = await getContracts();
      
      if (!contracts?.marketplaceContract) {
        throw new Error('Contract not initialized');
      }

      const { marketplaceContract } = contracts;
      
      // Check if agent exists
      const agentDetails = await marketplaceContract.agents(finalAgentId).catch((error: Error) => {
        console.error('Error fetching agent details:', error);
        return null;
      });

      if (!agentDetails?.isActive) {
        console.log('Agent not registered, registering first...');
        try {
          const regTx = await registerAgent(
            finalAgentId,
            0,
            process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS
          );
          console.log('Registration transaction sent:', regTx);
          
          // Wait for registration to be confirmed
          const regReceipt = await regTx.wait();
          console.log('Registration confirmed:', regReceipt);
        } catch (regError) {
          console.error('Failed to register agent:', regError);
          throw new Error(`Failed to register agent: ${regError instanceof Error ? regError.message : 'Unknown error'}`);
        }
      }

      // Execute the purchase with zero value
      console.log('Executing purchase with 0 ETH');
      let purchaseTx;
      try {
        purchaseTx = await marketplaceContract.purchaseAgent(finalAgentId, {
          value: ethers.parseEther("0")
        });
        console.log('Purchase transaction sent:', purchaseTx);
      } catch (purchaseError) {
        console.error('Failed to send purchase transaction:', purchaseError);
        throw new Error(`Failed to send purchase transaction: ${purchaseError instanceof Error ? purchaseError.message : 'Unknown error'}`);
      }
      
      // Wait for transaction confirmation
      let receipt;
      try {
        receipt = await purchaseTx.wait();
        console.log('Purchase receipt received:', receipt);
      } catch (waitError) {
        console.error('Failed while waiting for transaction confirmation:', waitError);
        throw new Error(`Failed to confirm transaction: ${waitError instanceof Error ? waitError.message : 'Unknown error'}`);
      }
      
      // Access hash from receipt (it's a property, not a method)
      const txHash = receipt.hash;
      if (!txHash) {
        console.error('Receipt received but no hash found:', receipt);
        throw new Error('Transaction completed but hash was not found in receipt');
      }
      
      const explorerUrl = `https://sepolia.basescan.org/tx/${txHash}`;
      console.log('Purchase successful! View transaction:', explorerUrl);
      
      // Only call onSuccess if we have a valid hash
      onSuccess?.(txHash);
      onClose?.();
      
      return txHash;
    } catch (error) {
      console.error('Payment failed:', error);
      onError?.(error instanceof Error ? error : new Error('Payment failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handlePayment}
      disabled={loading}
      className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        address ? `Pay ${amount} ETH` : 'Connect Wallet'
      )}
    </Button>
  );
}