import React from 'react';
import { TranscriptionResponse } from '../services/elevenlabsService';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Button, 
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import { SaveIcon, CopyIcon, RefreshIcon } from './icons';

interface TranscriptionProps {
  transcription: TranscriptionResponse;
  onSave: () => void;
  onNewRecording: () => void;
}

const Transcription: React.FC<TranscriptionProps> = ({ 
  transcription, 
  onSave, 
  onNewRecording 
}) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(transcription.text);
  };
  
  return (
    <Card 
      elevation={0} 
      sx={{ 
        width: '100%', 
        maxWidth: 500,
        mx: 'auto',
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Transcription Results
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
          <Chip 
            label={`Language: ${transcription.language_code.toUpperCase()}`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`Confidence: ${Math.round(transcription.language_probability * 100)}%`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3,
            backgroundColor: 'rgba(98, 0, 238, 0.05)',
            borderRadius: 2,
            maxHeight: '50vh',
            overflow: 'auto',
            mb: 3
          }}
        >
          <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
            {transcription.text}
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={onSave}
          >
            SAVE
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CopyIcon />}
            onClick={handleCopyToClipboard}
          >
            COPY
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onNewRecording}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(98, 0, 238, 0.08)',
              },
              boxShadow: 'none'
            }}
          >
            NEW
          </Button>
        </Box>
      </CardContent>
      
    </Card>
  );
};

export default Transcription;
