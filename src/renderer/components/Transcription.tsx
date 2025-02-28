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
  IconButton,
  Tooltip
} from '@mui/material';
import { SaveIcon, CopyIcon, RefreshIcon, DownloadIcon } from './icons';

const { ipcRenderer } = window.require('electron');

interface TranscriptionProps {
  transcription: TranscriptionResponse & { audioPath?: string };
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

  const handleDownloadAudio = async () => {
    if (!transcription.audioPath) {
      console.error('Audio path not available');
      return;
    }

    try {
      const { filePath } = await ipcRenderer.invoke('show-save-dialog', {
        title: 'Save Audio Recording',
        defaultPath: 'recording.wav',
        filters: [{ name: 'Audio Files', extensions: ['wav'] }]
      });

      if (filePath) {
        await ipcRenderer.invoke('copy-audio-file', transcription.audioPath, filePath);
        console.log('Audio saved successfully to:', filePath);
      }
    } catch (error) {
      console.error('Failed to save audio:', error);
    }
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

        {/* First row of buttons: SAVE, COPY, AUDIO */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
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
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadAudio}
          >
            AUDIO
          </Button>
        </Box>

        {/* Second row with NEW button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={onNewRecording}
          >
            NEW
          </Button>
        </Box>
      </CardContent>
      
    </Card>
  );
};

export default Transcription;
