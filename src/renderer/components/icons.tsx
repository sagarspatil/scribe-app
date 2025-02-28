import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

// Re-export Material icons that we need
export { Mic as MicrophoneIcon } from '@mui/icons-material';
export { MicOff as MicrophoneOffIcon } from '@mui/icons-material';
export { Stop as StopIcon } from '@mui/icons-material';
export { Save as SaveIcon } from '@mui/icons-material';
export { ContentCopy as CopyIcon } from '@mui/icons-material';
export { Settings as SettingsIcon } from '@mui/icons-material';
export { NoteAdd as NoteAddIcon } from '@mui/icons-material';
export { Create as CreateIcon } from '@mui/icons-material';
export { VolumeUp as VolumeUpIcon } from '@mui/icons-material';
export { Refresh as RefreshIcon } from '@mui/icons-material';
export { Pause as PauseIcon } from '@mui/icons-material';
export { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
export { Download as DownloadIcon } from '@mui/icons-material';

// Custom RecordIcon using the SVG path from Record.svg
export const RecordIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" 
    />
  </SvgIcon>
);
