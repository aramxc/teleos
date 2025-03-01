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
import { useAgentSubmission } from "@/hooks/useAgentSubmission";

interface AgentFormData {
  name: string;
  description: string;
  price: number;
  walletAddress: string;
  url: string;
  tags: string;
}

interface StatusState {
  message: string;
  type: "success" | "error" | "info" | null;
  txHash?: string;
  step?: "blockchain" | "backend" | null;
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
  const [status, setStatus] = useState<StatusState>({
    message: "",
    type: null,
    step: null,
  });

  const { submitAgent, error: submitError } = useAgentSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({
      message: "Registering agent on blockchain...",
      type: "info",
      step: "blockchain",
    });

    try {
      // First, register on the blockchain
      if (!coinbaseProvider) throw new Error("Wallet provider not initialized");

      // Get signer from provider
      const signer = await coinbaseProvider.getSigner();
      const contract = getAgentMarketplaceContract(signer, "localhost");

      const agentId = `agent-${Date.now()}`;
      const priceInUSDC = formData.price * 1_000_000;

      const tx = await contract.registerAgent(agentId, priceInUSDC);
      const receipt = await tx.wait();

      // Update status for backend submission
      setStatus({
        message: "Uploading agent details...",
        type: "info",
        step: "backend",
        txHash: receipt.transactionHash,
      });

      // Then, submit to our backend
      await submitAgent({
        name: formData.name,
        description: formData.description,
        websiteLink: formData.url,
        icon: "/default-icon.png",
        url: formData.url,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        price: formData.price,
        address: formData.walletAddress,
      });

      setStatus({
        message: "Agent registered successfully!",
        type: "success",
        txHash: receipt.transactionHash,
        step: null,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus({
        message: submitError || "Failed to register agent",
        type: "error",
        step: null,
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
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {status.step && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-theme-button-primary border-t-transparent" />
                )}
                {status.message}
              </div>

              {status.step === "blockchain" && (
                <div className="text-sm text-theme-text-secondary">
                  Step 1/2: Registering on blockchain...
                </div>
              )}

              {status.step === "backend" && (
                <div className="text-sm text-theme-text-secondary">
                  Step 2/2: Uploading agent details...
                </div>
              )}

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
            </div>
          </Alert>
        )}
      </Box>
    </motion.div>
  );
}
