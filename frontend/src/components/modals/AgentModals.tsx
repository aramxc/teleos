import { useState, memo, useEffect } from "react";
import {
  Button,
  Typography,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import BaseModal from "./BaseModal";
import { PayWithCBWallet } from "@/components/wallet/PayWithCBWallet";
import TagBubble from "@/components/shared/TagBubble";
import { Agent } from "@/types/agents";
import { useChatContext } from "@/contexts/ChatContext";

const DEMO_AMOUNT = 0.00;

export interface AgentRequirements {
  duration: number;
  frequency: number;
  frequencyUnit: string;
  photoOption: string;
  creativity: number;
}

export interface AgentConfigModalProps {
  open: boolean;
  onClose: () => void;
  agent: Agent;
}

type ModalStep = "info" | "requirements" | "review";


const AgentConfigModal = memo(function AgentConfigModal({
  open,
  onClose,
  agent,
}: AgentConfigModalProps) {
  const { sendMessage } = useChatContext();
  const [currentStep, setCurrentStep] = useState<ModalStep>("info");
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!open) {
      setTimeout(() => setCurrentStep("info"), 200);
    }
  }, [open]);

  const [requirements, setRequirements] = useState<AgentRequirements>({
    duration: 1,
    frequency: 1,
    frequencyUnit: "day",
    photoOption: "generate",
    creativity: 50,
  });

  const handleRequirementChange = (
    field: keyof AgentRequirements,
    value: number | string
  ) => {
    setRequirements((prev) => ({ ...prev, [field]: value }));
  };
  
  const inputStyles = {
    "& .MuiInputLabel-root": {
      color: "var(--text-secondary)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "var(--text-primary)",
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
    "& .MuiSelect-icon": {
      color: "var(--text-primary)",
    },
  };

  const renderInfoContent = () => (
    <Stack spacing={2} className="h-full flex flex-col">
      <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-6 border border-black/20 shadow-lg sm:max-h-[80vh] flex-1 overflow-y-hidden">
        <Stack spacing={4}>
        <Typography
              variant="h6"
              className="mb-3 text-Large font-medium  tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent"
            >
              About
            </Typography>
            <hr className="border-theme-border-primary"></hr>
          {/* Description Section */}
          <div className="overflow-y-auto max-h-[400px] md:max-h-full">
           
            
            <Typography className="text-theme-text-secondary leading-relaxed">
              {agent.description}
            </Typography>
          </div>

          
        </Stack>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {agent.tags.slice(0, 2).map((tag, index) => (
          <TagBubble key={index} tag={tag} />
        ))}
        {agent.tags.length > 2 && (
          <div className="group relative">
            <span className="text-sm text-theme-text-secondary cursor-pointer">
              +{agent.tags.length - 2} more
            </span>
            <div className="absolute left-0 sm:bottom-20 md:bottom-10 bottom-full mb-2 hidden group-hover:flex flex-wrap gap-2 rounded-lg p-2 z-10">
              {agent.tags.slice(2).map((tag, index) => (
                <TagBubble key={index + 2} tag={tag} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between mt-4">
        {agent.websiteLink ? (
          <a
            href={agent.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors duration-200"
          >
            <span className="mr-0">Learn more about {agent.name}</span>
            <svg
              className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        ) : (
          <div /> 
        )}
        <Button
          variant="contained"
          onClick={() => {
            setDirection(1);
            setCurrentStep("requirements");
          }}
          className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white px-8 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Continue
        </Button>
      </div>
    </Stack>
  );

  const renderRequirementsContent = () => (
    <Stack spacing={2} className="h-full flex flex-col">
      <Typography className="mt-4 mb-6 text-theme-text-secondary text-xl">
        Set your base requirements.
      </Typography>
      <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary flex-1">
        <Stack spacing={3}>
          <TextField
            value={requirements.duration}
            onChange={(e) =>
              handleRequirementChange("duration", Number(e.target.value))
            }
            autoFocus
            autoComplete="off"
            fullWidth
            type="number"
            label="Campaign Duration (days)"
            InputProps={{
              inputProps: { min: 1 },
              sx: { color: "var(--text-primary)" },
            }}
            sx={inputStyles}
          />

          <div className="flex gap-4">
            <TextField
              value={requirements.frequency}
              onChange={(e) =>
                handleRequirementChange("frequency", Number(e.target.value))
              }
              type="number"
              label="Frequency of Posts"
              InputProps={{
                inputProps: { min: 1 },
                sx: { color: "var(--text-primary)" },
              }}
              sx={inputStyles}
              className="flex-1"
            />
            <FormControl sx={inputStyles} className="min-w-[120px]">
              <InputLabel>Per</InputLabel>
              <Select
                value={requirements.frequencyUnit}
                onChange={(e) =>
                  handleRequirementChange("frequencyUnit", e.target.value)
                }
                label="Per"
              >
                <MenuItem value="minute">Minute</MenuItem>
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
              </Select>
            </FormControl>
          </div>

          <FormControl sx={inputStyles}>
            <InputLabel>Photo Options</InputLabel>
            <Select
              value={requirements.photoOption}
              onChange={(e) =>
                handleRequirementChange("photoOption", e.target.value)
              }
              label="Photo Options"
            >
              <MenuItem value="generate">Generate AI Photos</MenuItem>
              <MenuItem value="upload">Upload Own Photos</MenuItem>
            </Select>
          </FormControl>

          <div>
            <Typography className="text-theme-text-primary mb-2 font-medium tracking-tight">
              Creativity Level:{" "}
              <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
                {requirements.creativity}%
              </span>
            </Typography>
            <Slider
              value={requirements.creativity}
              onChange={(_, value) =>
                handleRequirementChange(
                  "creativity",
                  Array.isArray(value) ? value[0] : value
                )
              }
              aria-label="Creativity"
              valueLabelDisplay="auto"
              sx={{
                color: "var(--button-primary)",
                "& .MuiSlider-thumb": {
                  backgroundColor: "var(--button-primary)",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "var(--button-primary)",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "var(--border-primary)",
                },
              }}
            />
          </div>

          <div>
            <Typography className="text-theme-text-primary mb-2 font-medium tracking-tight">
              Tone:{" "}
              <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
                50%
              </span>
            </Typography>
            <Slider
              defaultValue={50}
              valueLabelDisplay="auto"
              sx={{
                color: "var(--button-primary)",
                "& .MuiSlider-thumb": {
                  backgroundColor: "var(--button-primary)",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "var(--button-primary)",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "var(--border-primary)",
                },
              }}
            />
          </div>
        </Stack>
      </div>
    </Stack>
  );

  const renderReviewContent = () => (
    <Stack spacing={3} className="h-full flex flex-col">
      {/* Top section with welcome text */}
      <div>
        <Typography className="mt-4 mb-6 text-theme-text-secondary text-xl">
          Check over your details and confirm.
        </Typography>

        {/* Campaign Details */}
        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary">
          <Typography
            variant="h6"
            className="mb-3 text-sm font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent"
          >
            Timeline
          </Typography>

          <Stack spacing={2}>
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">
                Estimated Start
              </Typography>
              <Typography className="text-theme-text-primary">
                Within 24 hours
              </Typography>
            </div>

            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">
                Campaign Length
              </Typography>
              <Typography className="text-theme-text-primary">
                {requirements.duration} days
              </Typography>
            </div>
          </Stack>
        </div>

        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary mt-3">
          <Typography
            variant="h6"
            className="mb-3 text-sm font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent"
          >
            Campaign Details
          </Typography>

          <Stack spacing={2}>
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">
                Duration
              </Typography>
              <Typography className="text-theme-text-primary">
                {requirements.duration} days
              </Typography>
            </div>

            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">
                Frequency
              </Typography>
              <Typography className="text-theme-text-primary">
                {requirements.frequency} posts per {requirements.frequencyUnit}
              </Typography>
            </div>

            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">
                Photo Option
              </Typography>
              <Typography className="text-theme-text-primary capitalize">
                {requirements.photoOption}
              </Typography>
            </div>

            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">
                Creativity Level
              </Typography>
              <Typography className="text-theme-text-primary">
                {requirements.creativity}%
              </Typography>
            </div>
          </Stack>
        </div>

        {/* Price Display */}
        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary mt-3">
          <Typography
            variant="h6"
            className="text-right mb-0 text-lg text-theme-text-secondary font-medium tracking-tight"
          >
            Total Price:{" "}
            <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
              {DEMO_AMOUNT} ETH
            </span>
          </Typography>
        </div>
      </div>
    </Stack>
  );



  return (
    
    <BaseModal 
      open={open} 
      onClose={onClose} 
      title={agent.name}
      icon={agent.icon}
    >
      <div className="relative flex items-center justify-center h-full overflow-x-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -1000 : 1000, opacity: 0 }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full px-4"
          >
            {currentStep === "info" && (
              <Stack spacing={2} className="h-full flex flex-col">
                {renderInfoContent()}
              </Stack>
            )}
            {currentStep === "requirements" && (
              <Stack
                spacing={3}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex-1">{renderRequirementsContent()}</div>

                <div className="flex items-center justify-between mt-auto">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setDirection(-1);
                      setCurrentStep("info");
                    }}
                    className="border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDirection(1);
                      setCurrentStep("review");
                    }}
                    className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
                  >
                    Review
                  </Button>
                </div>
              </Stack>
            )}
            {currentStep === "review" && (
              <Stack
                spacing={3}
                className="h-full flex flex-col justify-between"
              >
                {renderReviewContent()}
                <div className="flex items-center justify-between mt-auto">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setDirection(-1);
                      setCurrentStep("requirements");
                    }}
                    className="border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
                  >
                    Back
                  </Button>
                  <PayWithCBWallet
                    amount={DEMO_AMOUNT}
                    agentId={agent.id || agent.name.toLowerCase().replace(/\s+/g, '-')}
                    onClose={onClose}
                    onSuccess={async (txHash) => {
                      if (!txHash) {
                        console.error('No transaction hash received');
                        return;
                      }
                      
                      console.log(`Agent purchased! Transaction: ${txHash}`);
                      
                      try {
                        const message = `🎉 Purchase successful! View transaction: https://sepolia.basescan.org/tx/${txHash}`;
                        await sendMessage(message);
                        onClose();
                      } catch (error) {
                        console.error('Failed to send success message:', error);
                        onClose();
                      }
                    }}
                    onError={(error) => {
                      console.error("Purchase failed:", error);
                    }}
                  />
                </div>
              </Stack>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </BaseModal>
  );
});

export { AgentConfigModal };
