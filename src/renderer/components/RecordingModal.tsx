import React, { useState, useEffect, useRef } from 'react';
import AudioRecorder from '../services/audioRecorder';
import Waveform from './Waveform';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (audioPath: string) => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      recorderRef.current = new AudioRecorder(
        (recording) => setIsRecording(recording),
        (data) => setAudioData(data)
      );
      
      // Start recording automatically when modal opens
      handleStartRecording();
    }
    
    return () => {
      if (recorderRef.current) {
        recorderRef.current.cancel();
      }
    };
  }, [isOpen]);
  
  const handleStartRecording = async () => {
    try {
      await recorderRef.current?.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };
  
  const handleStopRecording = async () => {
    try {
      if (recorderRef.current) {
        const audioPath = await recorderRef.current.stop();
        onComplete(audioPath);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };
  
  const handleCancelRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.cancel();
    }
    onClose();
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        handleCancelRecording();
      } else if (e.key === ' ' || e.code === 'Space') {
        if (isRecording) {
          handleStopRecording();
        } else {
          handleStartRecording();
        }
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRecording]);
  
  if (!isOpen) return null;
  
  return (
    <div className="recording-modal">
      <div className="visualization-container">
        {isRecording && audioData ? (
          <Waveform audioData={audioData} />
        ) : (
          <div className="dotted-line" />
        )}
        
        <div style={{ position: 'absolute', left: '10px', display: 'flex', alignItems: 'center' }}>
          <div className="recording-indicator" style={{ opacity: isRecording ? 1 : 0.3 }} />
          <div className="alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#666">
              <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-7h2v5h-2z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="controls">
        <button className="control-button" onClick={handleStopRecording}>
          Stop
        </button>
        <button className="control-button">
          ⌥Space
        </button>
        <button className="control-button" onClick={handleCancelRecording}>
          Cancel
        </button>
        <button className="control-button">
          Esc
        </button>
      </div>
    </div>
  );
};

export default RecordingModal;
