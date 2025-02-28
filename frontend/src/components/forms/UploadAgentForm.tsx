import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import { coinbaseProvider } from "@/lib/coinbaseWallet";
import { getAgentMarketplaceContract } from "@/contracts/types/AgentMarketPlace";
import { motion } from "framer-motion";

interface AgentFormData {
  name: string;
  description: string;
  price: number;
  walletAddress: string;
  url: string;
  tags: string;
}

export function UploadAgentForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState<AgentFormData>({
    name: "",
    description: "",
    price: 0,
    walletAddress: "",
    url: "",
    tags: "",
  });
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error" | "info" | null;
    txHash?: string;
  }>({ message: "", type: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: "Uploading agent...", type: "info" });

    try {
      if (!coinbaseProvider) throw new Error("Wallet provider not initialized");
      const contract = getAgentMarketplaceContract(
        coinbaseProvider,
        "localhost"
      );

      const agentId = `agent-${Date.now()}`;
      const priceInUSDC = formData.price * 1_000_000;

      const tx = await contract.registerAgent(agentId, priceInUSDC);
      const receipt = await tx.wait();

      setStatus({
        message: "Agent registered successfully!",
        type: "success",
        txHash: receipt.transactionHash,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus({
        message: "Failed to register agent",
        type: "error",
      });
    }
  };

  const inputStyles = {
    "& .MuiInputLabel-root": {
      color: "var(--text-secondary)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--text-secondary)",
    },
    "& .MuiOutlinedInput-root": {
      color: "var(--text-primary)",
      "& fieldset": {
        borderColor: "var(--border-primary)",
      },
      "&:hover fieldset": {
        borderColor: "var(--border-secondary)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--button-primary)",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="md:pt-20 flex items-center"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "600px", md: "900px" },
          mx: "auto",
          py: { xs: 2, sm: 3, md: 1 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h4"
          className="text-theme-text-primary font-bold mb-2 text-center sm:text-left"
          sx={{ fontSize: { xs: "1.75rem", sm: "2rem" } }}
        >
          Submit an Agent
        </Typography>

        <hr className="border-theme-border-primary mb-2" />

        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 md:p-5 border border-black/20 shadow-xl shadow-black/10">
          <Stack spacing={{ xs: 2, md: 1.5 }}>
            <div className="grid md:grid-cols-2 gap-3">
              <TextField
                fullWidth
                label="Enter your agent's name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                sx={inputStyles}
                placeholder="Enter your agent's name"
              />

              <TextField
                fullWidth
                label="Price (USDC)"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                sx={inputStyles}
                placeholder="0.00"
              />

              <TextField
                fullWidth
                label="Wallet Address"
                value={formData.walletAddress}
                onChange={(e) =>
                  setFormData({ ...formData, walletAddress: e.target.value })
                }
                required
                sx={inputStyles}
                placeholder="0x..."
              />

              <TextField
                fullWidth
                label="Agent URL"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
                sx={inputStyles}
                placeholder="https://..."
              />
            </div>

            <TextField
              fullWidth
              label="Tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="AI, Writing, Analysis"
              required
              sx={inputStyles}
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
              required
              sx={inputStyles}
              placeholder="Describe what your agent does..."
            />
          </Stack>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-3">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white h-10 text-base font-medium"
          >
            Submit
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={onCancel}
            className="h-10 text-base font-medium border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
          >
            Cancel
          </Button>
        </div>

        {status.type && (
          <Alert
            severity={status.type}
            className="mt-4 bg-theme-panel-bg border border-theme-border-primary text-sm sm:text-base"
          >
            {status.message}
            {status.txHash && (
              <div className="mt-2">
                <a
                  href={`https://sepolia.basescan.org/tx/${status.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-button-primary hover:text-theme-button-hover underline text-sm sm:text-base"
                >
                  View transaction
                </a>
              </div>
            )}
          </Alert>
        )}
      </Box>
    </motion.div>
  );
}
