import { useState, memo } from 'react';
import { Typography, Slider, TextField, Select, MenuItem, FormControl, InputLabel, Button, Stack } from '@mui/material';
import BaseModal from './BaseModal';

export interface AgentRequirements {
  duration: number;
  frequency: number;
  frequencyUnit: string;
  photoOption: string;
  creativity: number;
}

interface RequirementsModalProps {
  open: boolean;
  onClose: () => void;
  agent: {
    name: string;
    description: string;
    tags: string[];
    websiteLink: string;
    icon: string;
    
  };
  onContinue: (requirements: AgentRequirements) => void;
}

const RequirementsModal = memo(function RequirementsModal({ open, onClose, agent, onContinue }: RequirementsModalProps) {
  const [duration, setDuration] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [frequencyUnit, setFrequencyUnit] = useState('day');
  const [photoOption, setPhotoOption] = useState('generate');
  const [creativity, setCreativity] = useState(50);

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

  const handleContinue = () => {
    onContinue({
      duration,
      frequency,
      frequencyUnit,
      photoOption,
      creativity
    });
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={agent.name}
      tags={agent.tags}
    >
      <Typography className="text-theme-text-secondary mb-4">
        {agent.description}
      </Typography>

      <Stack spacing={3} className="bg-theme-panel-bg backdrop-blur-xl rounded-lg p-4 border border-theme-border-primary">
        <TextField
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          autoFocus
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
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
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
              value={frequencyUnit}
              onChange={(e) => setFrequencyUnit(e.target.value)}
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
            value={photoOption}
            onChange={(e) => setPhotoOption(e.target.value)}
            label="Photo Options"
          >
            <MenuItem value="generate">Generate AI Photos</MenuItem>
            <MenuItem value="upload">Upload Own Photos</MenuItem>
          </Select>
        </FormControl>

        <div>
          <Typography className="text-theme-text-primary mb-2 font-medium tracking-tight">
            Creativity Level: <span className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">{creativity}%</span>
          </Typography>
          <Slider
            value={creativity}
            onChange={(_, value) => setCreativity(value as number)}
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

        <Button
          variant="contained"
          size="medium"
          className="bg-gradient-to-r from-theme-button-primary to-theme-button-hover hover:from-theme-button-hover hover:to-theme-button-primary text-white"
          onClick={handleContinue}
        >
          Continue to Review
        </Button>
      </Stack>
    </BaseModal>
  );
});

export default RequirementsModal;
