import { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { ethers } from 'ethers';
import { coinbaseProvider } from '@/lib/coinbaseWallet';
import { getAgentMarketplaceContract } from '@/contracts/types/AgentMarketPlace';
import { ChromaClient } from 'chromadb';

interface AgentFormData {
  name: string;
  description: string;
  price: number;
  walletAddress: string;
  url: string;
  tags: string;
}

export function UploadAgentForm() {
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    price: 0,
    walletAddress: '',
    url: '',
    tags: ''
  });
  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
    txHash?: string;
  }>({ message: '', type: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: 'Uploading agent...', type: 'info' });

    try {
      // 1. Register agent in smart contract
      const ethersProvider = new ethers.BrowserProvider(coinbaseProvider);
      const contract = getAgentMarketplaceContract(ethersProvider, 'localhost');
      
      const agentId = `agent-${Date.now()}`; // Unique ID
      const priceInUSDC = formData.price * 1_000_000; // Convert to USDC decimals

      const tx = await contract.registerAgent(agentId, priceInUSDC);
      const receipt = await tx.wait();

      // 2. Store in ChromaDB
      const chroma = new ChromaClient();
      const collection = await chroma.createCollection({
        name: 'agents',
        metadata: {
          agentId: agentId,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          walletAddress: formData.walletAddress,
          url: formData.url,
          tags: formData.tags.split(',').map(tag => tag.trim()).join(', '),
          contractTxHash: receipt.transactionHash
        }
      });
      
      await collection.add({
        ids: [agentId],
        metadatas: [{
          name: formData.name,
          description: formData.description,
          price: formData.price,
          walletAddress: formData.walletAddress,
          url: formData.url,
          tags: formData.tags.split(',').map(tag => tag.trim()).join(', '),
          contractTxHash: receipt.transactionHash
        }],
        documents: [
          `Agent Name: ${formData.name}\n` +
          `Description: ${formData.description}\n` +
          `Tags: ${formData.tags}`
        ]
      });

      setStatus({ 
        message: 'Agent registered successfully!', 
        type: 'success',
        txHash: receipt.transactionHash 
      });

    } catch (error) {
      console.error('Upload failed:', error);
      setStatus({ 
        message: 'Failed to register agent', 
        type: 'error' 
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <h2 className="text-2xl font-bold mb-4">Register New Agent</h2>
      
      <TextField
        fullWidth
        label="Agent Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        margin="normal"
        multiline
        rows={4}
        required
      />

      <TextField
        fullWidth
        label="Price (USDC)"
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Wallet Address"
        value={formData.walletAddress}
        onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Agent URL"
        value={formData.url}
        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        margin="normal"
        helperText="Enter tags separated by commas (e.g., AI, Writing, Analysis)"
        required
      />

      <Button 
        type="submit" 
        variant="contained" 
        className="mt-4 bg-gradient-to-r from-theme-button-primary to-theme-button-hover"
        fullWidth
      >
        Register Agent
      </Button>

      {status.type && (
        <Alert severity={status.type} className="mt-4">
          {status.message}
          {status.txHash && (
            <div className="mt-2">
              <a 
                href={`https://sepolia.basescan.org/tx/${status.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View transaction
              </a>
            </div>
          )}
        </Alert>
      )}
    </Box>
  );
}