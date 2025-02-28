import { useState, memo, useEffect } from 'react';
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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import BaseModal from './BaseModal';
import { PayWithCBWallet } from '@/components/wallet/PayWithCBWallet';
import TagBubble from '@/components/shared/TagBubble';
import { Agent } from '@/types/agents';

export interface AgentRequirements {
  duration: number;
  frequency: number;
  frequencyUnit: string;
  photoOption: string;
  creativity: number;
}

interface AgentConfigModalProps {
  open: boolean;
  onClose: () => void;
  agent: Agent;
}

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  onHire: () => void;
  agent: Agent;
}

type ModalStep = 'info' | 'requirements' | 'review';

const TagsSection = memo(function TagsSection({ tags }: { tags: string[] }) {
  return (
    <div className="py-2">
      <div className="overflow-x-auto md:overflow-x-visible pb-2">
        <div className="flex flex-nowrap md:flex-wrap gap-2">
          {tags.map((tag, index) => (
            <TagBubble key={index} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
});

const AgentInfoModal = memo(function AgentInfoModal({ open, onClose, onHire, agent }: InfoModalProps) {
  return (
    <BaseModal 
      open={open} 
      onClose={onClose} 
      title={agent.name}
      icon={agent.icon}
    >
      <div className="relative flex items-center justify-center h-full overflow-hidden">
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -1000, opacity: 0 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full px-4"
        >
          <Stack spacing={3} className="h-full flex flex-col justify-between">
            <div className="flex-1 space-y-6">
              <div className="bg-theme-panel-bg backdrop-blur-xl shadow-lg rounded-lg p-6 border border-theme-border-primary shadow-xl shadow-black/10">
                <Typography className="text-theme-text-secondary">
                  {agent.description}
                </Typography>
              </div>

              <TagsSection tags={agent.tags} />
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              
              <Button
                variant="contained"
                onClick={onHire}
                className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
              >
                Hire Now
              </Button>
            </div>
          </Stack>
        </motion.div>
      </div>
    </BaseModal>
  );
});

const AgentConfigModal = memo(function AgentConfigModal({ open, onClose, agent }: AgentConfigModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>('info');
  const [direction, setDirection] = useState(0);
 
  
  useEffect(() => {
    if (!open) {
      setTimeout(() => setCurrentStep('info'), 200);
    }
  }, [open]);

  const [requirements, setRequirements] = useState<AgentRequirements>({
    duration: 1,
    frequency: 1,
    frequencyUnit: 'day',
    photoOption: 'generate',
    creativity: 50
  });

  const handleRequirementChange = (
    field: keyof AgentRequirements, 
    value: number | string
  ) => {
    setRequirements(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalPrice = () => {
    const daysMultiplier = requirements.frequencyUnit === 'day' ? 1 
      : requirements.frequencyUnit === 'hour' ? 24 
      : 1440;
    const postsPerDay = requirements.frequency * daysMultiplier;
    return agent.price * requirements.duration * postsPerDay;
  };

 

  const inputStyles = {
    '& .MuiInputLabel-root': {
      color: 'var(--text-secondary)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'var(--text-primary)',
    },
    '& .MuiOutlinedInput-root': {
      color: 'var(--text-primary)',
      '& fieldset': {
        borderColor: 'var(--border-primary)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--border-secondary)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--button-primary)',
      },
    },
    '& .MuiSelect-icon': {
      color: 'var(--text-primary)',
    },
  };

  const renderRequirementsContent = () => (
    <Stack spacing={2} className="h-full flex flex-col">
      <Typography className="mt-4 mb-6 text-theme-text-secondary text-xl">
        Set your base requirements.
        </Typography>
      <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary flex-1">
        <Stack spacing={3}>
          <TextField
            value={requirements.duration}
            onChange={(e) => handleRequirementChange('duration', Number(e.target.value))}
            autoComplete="off"
            fullWidth
            type="number"
            label="Campaign Duration (days)"
            InputProps={{ 
              inputProps: { min: 1 },
              sx: { color: 'var(--text-primary)' }
            }}
            sx={inputStyles}
          />

          <div className="flex gap-4">
            <TextField
              value={requirements.frequency}
              onChange={(e) => handleRequirementChange('frequency', Number(e.target.value))}
              type="number"
              label="Frequency of Posts"
              InputProps={{ 
                inputProps: { min: 1 },
                sx: { color: 'var(--text-primary)' }
              }}
              sx={inputStyles}
              className="flex-1"
            />
            <FormControl sx={inputStyles} className="min-w-[120px]">
              <InputLabel>Per</InputLabel>
              <Select
                value={requirements.frequencyUnit}
                onChange={(e) => handleRequirementChange('frequencyUnit', e.target.value)}
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
              onChange={(e) => handleRequirementChange('photoOption', e.target.value)}
              label="Photo Options"
            >
              <MenuItem value="generate">Generate AI Photos</MenuItem>
              <MenuItem value="upload">Upload Own Photos</MenuItem>
            </Select>
          </FormControl>

          <div>
            <Typography className="text-theme-text-primary mb-2 font-medium tracking-tight">
              Creativity Level: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{requirements.creativity}%</span>
            </Typography>
            <Slider
              value={requirements.creativity}
              onChange={(_, value) => handleRequirementChange('creativity', Array.isArray(value) ? value[0] : value)}
              aria-label="Creativity"
              valueLabelDisplay="auto"
              sx={{
                color: 'var(--button-primary)',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'var(--text-primary)',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'var(--button-primary)',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'var(--border-primary)',
                },
              }}
            />
          </div>

          <div>
            <Typography className="text-theme-text-primary mb-2 font-medium tracking-tight">
              Tone: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">50%</span>
            </Typography>
            <Slider
              defaultValue={50}
              valueLabelDisplay="auto"
              sx={{
                color: 'var(--button-primary)',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'var(--text-primary)',
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'var(--button-primary)',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'var(--border-primary)',
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
          <Typography variant="h6" className="mb-3 text-sm font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
            Timeline
          </Typography>
          
          <Stack spacing={2}>
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Estimated Start</Typography>
              <Typography className="text-theme-text-primary">
                Within 24 hours
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Campaign Length</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.duration} days
              </Typography>
            </div>
        
          </Stack>
        </div>

        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary mt-3">
          <Typography variant="h6" className="mb-3 text-sm font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
            Campaign Details
          </Typography>
          
          <Stack spacing={2}>
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Duration</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.duration} days
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Frequency</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.frequency} posts per {requirements.frequencyUnit}
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Photo Option</Typography>
              <Typography className="text-theme-text-primary capitalize">
                {requirements.photoOption}
              </Typography>
            </div>
            
            <div className="flex items-center justify-between text-base">
              <Typography className="text-theme-text-secondary">Creativity Level</Typography>
              <Typography className="text-theme-text-primary">
                {requirements.creativity}%
              </Typography>
            </div>
          </Stack>
        </div>

        {/* Price Display */}
        <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary mt-3">
          <Typography variant="h6" className="text-right mb-0 text-lg font-medium tracking-tight">
            Total Price: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{calculateTotalPrice()} USDC</span>
          </Typography>
        </div>
      </div>
    </Stack>
  );

  return (
    <BaseModal open={open} onClose={onClose} title={agent.name}>
      <div className="relative flex items-center justify-center h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -1000 : 1000, opacity: 0 }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full px-4"
          >
            {currentStep === 'info' && (
              <Stack spacing={3} className="h-full flex flex-col justify-between">
                <div className="flex-1 space-y-6">
                  <div className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-6 border border-theme-border-primary shadow-xl shadow-black/10">
                    <Typography className="text-theme-text-secondary">
                      {agent.description}
                    </Typography>
                  </div>

                  <TagsSection tags={agent.tags} />
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  {agent.websiteLink && (
                    <a
                      href={agent.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors duration-200"
                    >
                      Visit Website
                      <svg 
                        className="ml-2 w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDirection(1);
                      setCurrentStep('requirements');
                    }}
                    className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
                  >
                    Continue
                  </Button>
                </div>
              </Stack>
            )}
            {currentStep === 'requirements' && (
              <Stack spacing={3} className="h-full flex flex-col justify-between">
                <div className="flex-1">
                  {renderRequirementsContent()}
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setDirection(-1);
                      setCurrentStep('info');
                    }}
                    className="border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDirection(1);
                      setCurrentStep('review');
                    }}
                    className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
                  >
                    Review
                  </Button>
                </div>
              </Stack>
            )}
            {currentStep === 'review' && (
              <Stack spacing={3} className="h-full flex flex-col justify-between">
                {renderReviewContent()}
                <div className="flex items-center justify-between mt-auto">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setDirection(-1);
                      setCurrentStep('requirements');
                    }}
                    className="border-theme-button-primary text-theme-button-primary hover:border-theme-button-hover hover:bg-theme-button-primary/5"
                  >
                    Back
                  </Button>
                  <PayWithCBWallet 
                    amount={calculateTotalPrice()} 
                    agentId={agent.id}
                    onSuccess={(txHash) => {
                      console.log(`Agent purchased! Transaction: ${txHash}`);
                      onClose();
                    }}
                    onError={(error) => {
                      console.error('Purchase failed:', error);
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

export { AgentInfoModal, AgentConfigModal };