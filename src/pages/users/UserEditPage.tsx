import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const UserEditPage: React.FC = () => {
  const { id } = useParams();
  const isNewUser = !id;

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isNewUser ? 'Add New User' : `Edit User #${id}`}
        </Typography>
        <Typography variant="body1">
          User form will be displayed here.
        </Typography>
      </Box>
    </Container>
  );
};

export default UserEditPage; 