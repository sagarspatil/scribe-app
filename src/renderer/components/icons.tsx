import React from 'react';

// Import SVG files directly
// @ts-ignore
import MicrophoneSvg from './icons/Microphone.svg';
// @ts-ignore
import MicrophoneOffSvg from './icons/Microphone Off.svg';
// @ts-ignore
import SettingsSvg from './icons/Settings Adjust vr-al.svg';

// Modern iOS-style microphone icon for record button
export const MicrophoneIcon: React.FC = () => (
  <img src={MicrophoneSvg} alt="Microphone" width="24" height="24" />
);

// Mute microphone icon
export const MicrophoneOffIcon: React.FC = () => (
  <img src={MicrophoneOffSvg} alt="Microphone Off" width="24" height="24" />
);

// Modern iOS-style settings icon - clean minimal gear
export const SettingsIcon: React.FC = () => (
  <img src={SettingsSvg} alt="Settings" width="24" height="24" />
);

// Stop icon for recording control
export const StopIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width="24" 
    height="24"
  >
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
  </svg>
);

// Save icon for saving transcription
export const SaveIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width="24" 
    height="24"
  >
    <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 14.25a.75.75 0 000 1.5H15a.75.75 0 000-1.5H9.75z" clipRule="evenodd" />
    <path d="M3.75 5.25c0-.966.784-1.75 1.75-1.75h.727a.75.75 0 010 1.5H5.5a.25.25 0 00-.25.25v10.5a.25.25 0 00.25.25h10.5a.25.25 0 00.25-.25v-.727a.75.75 0 011.5 0v.727A1.75 1.75 0 0116 18.25H5.5a1.75 1.75 0 01-1.75-1.75V5.25z" />
  </svg>
);

// Copy icon for copying transcription
export const CopyIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    width="24" 
    height="24"
  >
    <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z" clipRule="evenodd" />
    <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
    <path d="M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" />
  </svg>
);
