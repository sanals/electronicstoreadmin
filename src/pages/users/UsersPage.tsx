import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const UsersPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users
        </Typography>
        <Typography variant="body1">
          User listing will be displayed here.
        </Typography>
      </Box>
    </Container>
  );
};

export default UsersPage; 