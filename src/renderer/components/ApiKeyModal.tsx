import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  TextField,
  Typography,
  Link,
  Box
} from '@mui/material';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        elevation: 2,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        Enter Eleven Labs API Key
      </DialogTitle>
      
      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          An API key is required to use the transcription service.
          You can get your API key from the{' '}
          <Link 
            href="https://elevenlabs.io/app" 
            target="_blank" 
            rel="noopener noreferrer"
            underline="hover"
          >
            Eleven Labs dashboard
          </Link>.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            autoFocus
            margin="dense"
            id="apiKey"
            label="API Key"
            type="text"
            fullWidth
            variant="outlined"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Eleven Labs API key"
            required
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={!apiKey.trim()}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyModal;
