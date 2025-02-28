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
        borderRadius: 2, 
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Transcription
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            backgroundColor: 'rgba(0, 0, 0, 0.02)', 
            borderRadius: 1,
            maxHeight: '50vh',
            overflow: 'auto'
          }}
        >
          <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
            {transcription.text}
          </Typography>
        </Paper>
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={onSave}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CopyIcon />}
            onClick={handleCopyToClipboard}
          >
            Copy
          </Button>
        </Box>
        
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RefreshIcon />}
          onClick={onNewRecording}
        >
          New Recording
        </Button>
      </CardActions>
      
      <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Transcribed using Eleven Labs API
        </Typography>
      </Box>
    </Card>
  );
};

export default Transcription;
