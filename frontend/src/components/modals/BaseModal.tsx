import { Modal, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: React.ReactNode;
}

const BaseModal = ({ open, onClose, title, icon, children }: BaseModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex items-center justify-center"
      slotProps={{
        backdrop: {
          style: { 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }
        }
      }}
    >
      <Box 
        className="relative bg-theme-bg-primary backdrop-blur-xl
          border border-slate-700 rounded-lg w-[95%] md:w-[90%] max-w-xl
          h-[90vh] sm:h-[580px] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image src={icon} alt={title} fill className="object-cover rounded-lg" />
              </div>
            )}
            <Typography className="text-xl font-medium tracking-tight bg-gradient-to-r from-theme-button-primary to-theme-button-hover bg-clip-text text-transparent">
            {title}
            </Typography>
          </div>
          <IconButton onClick={onClose} className="text-theme-text-primary hover:text-theme-text-secondary">
            <CloseIcon />
          </IconButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {children}
        </div>
      </Box>
    </Modal>
  );
};

export default BaseModal;