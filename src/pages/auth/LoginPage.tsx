import React from 'react';
import { Box, Container } from '@mui/material';
import { LoginForm } from '../../components/auth';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Container maxWidth="sm">
        <LoginForm />
      </Container>
    </Box>
  );
};

export default LoginPage; 