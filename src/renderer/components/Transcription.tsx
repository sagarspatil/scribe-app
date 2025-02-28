import React from 'react';
import { TranscriptionResponse } from '../services/elevenlabsService';

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
    <div className="transcription-container">
      <div className="transcription-header">
        <h2>Transcription</h2>
        <div>
          <span>Language: {transcription.language_code}</span>
          <span> | Confidence: {Math.round(transcription.language_probability * 100)}%</span>
        </div>
      </div>
      
      <div className="transcription-text">
        {transcription.text}
      </div>
      
      <div className="transcription-actions">
        <button onClick={onSave}>Save to File</button>
        <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
        <button onClick={onNewRecording}>New Recording</button>
      </div>
      
      <div className="transcription-footer">
        <small>
          Transcribed using Eleven Labs API
        </small>
      </div>
    </div>
  );
};

export default Transcription;
