import React from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingIndicatorProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 40,
  color = 'primary',
  fullScreen = false
}) => {
  const loadingElement = (
    <CircularProgress color={color} size={size} />
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        {loadingElement}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      {loadingElement}
    </Box>
  );
};

export default LoadingIndicator; 