import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Grid, Link, Box, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types/api-responses';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

type FormData = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const username = data.username;
      const password = data.password;
      
      console.log('Attempting login with:', username);
      const success = await login(username, password);
      
      if (success) {
        console.log('Login successful, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Login failed, showing error message');
        setError('Invalid username or password. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Display more specific error message if available
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || 'Unknown error';
        
        if (status === 401) {
          setError('Invalid username or password. Please check your credentials.');
        } else if (status === 403) {
          setError('Account is locked or disabled. Please contact administrator.');
        } else if (status >= 500) {
          setError(`Server error: ${message}. Please try again later.`);
        } else {
          setError(`Login failed: ${message}`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection or contact support.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Electronics Store Admin
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          autoComplete="username"
          autoFocus
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={isLoading}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  disabled={isLoading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, height: 40 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign In'
          )}
        </Button>
        
        <Grid container>
          <Grid item xs>
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default LoginForm; 