import React, { useRef, useEffect } from 'react';

interface WaveformProps {
  audioData: Float32Array;
  isPaused?: boolean;
  color?: string;
}

const Waveform: React.FC<WaveformProps> = ({ 
  audioData, 
  isPaused = false, 
  color = '#6200ee' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set the line style
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    
    // Draw the waveform
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = audioData.length;
    const sliceWidth = width / bufferLength;
    
    let x = 0;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    for (let i = 0; i < bufferLength; i++) {
      const v = audioData[i];
      const y = (v * height / 2) + (height / 2);
      
      ctx.lineTo(x, y);
      x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Add a gradient background
    if (!isPaused) {
      // Only do the fancy rendering if not paused
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `${color}10`);
      gradient.addColorStop(1, `${color}01`);
      
      ctx.fillStyle = gradient;
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();
    }
  }, [audioData, isPaused, color]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={450} 
      height={80} 
      style={{ 
        width: '100%', 
        height: '100%',
        opacity: isPaused ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

export default Waveform;
