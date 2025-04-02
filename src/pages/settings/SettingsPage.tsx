import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1">
          Settings options will be displayed here.
        </Typography>
      </Box>
    </Container>
  );
};

export default SettingsPage; 