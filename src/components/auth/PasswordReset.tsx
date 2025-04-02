import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthService } from '../../services/auth.service';

type ForgotPasswordFormData = {
  email: string;
};

type ResetPasswordFormData = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

const forgotPasswordSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
}).required();

const resetPasswordSchema = yup.object({
  token: yup.string().required('Token is required'),
  newPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
}).required();

interface PasswordResetProps {
  mode: 'forgot' | 'reset';
}

const PasswordReset: React.FC<PasswordResetProps> = ({ mode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });
  
  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });
  
  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await AuthService.forgotPassword(data.email);
      if (response.status === 'SUCCESS') {
        setMessage({
          text: 'Password reset instructions sent to your email.',
          type: 'success',
        });
        forgotPasswordForm.reset();
      } else {
        setMessage({
          text: response.message || 'Failed to send password reset instructions.',
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: 'An error occurred. Please try again later.',
        type: 'error',
      });
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await AuthService.resetPassword(
        data.token,
        data.newPassword,
        data.confirmPassword
      );
      
      if (response.status === 'SUCCESS') {
        setMessage({
          text: 'Password has been reset successfully. You can now login with your new password.',
          type: 'success',
        });
        resetPasswordForm.reset();
      } else {
        setMessage({
          text: response.message || 'Failed to reset password.',
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: 'An error occurred. Please try again later.',
        type: 'error',
      });
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {mode === 'forgot' ? 'Forgot Password' : 'Reset Password'}
      </Typography>
      
      {message && (
        <Typography 
          color={message.type === 'success' ? 'success.main' : 'error'} 
          variant="body2" 
          sx={{ mb: 2 }}
        >
          {message.text}
        </Typography>
      )}
      
      {mode === 'forgot' ? (
        <Box component="form" onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...forgotPasswordForm.register('email')}
            error={!!forgotPasswordForm.formState.errors.email}
            helperText={forgotPasswordForm.formState.errors.email?.message}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="token"
            label="Reset Token"
            autoFocus
            {...resetPasswordForm.register('token')}
            error={!!resetPasswordForm.formState.errors.token}
            helperText={resetPasswordForm.formState.errors.token?.message}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPassword"
            label="New Password"
            type="password"
            {...resetPasswordForm.register('newPassword')}
            error={!!resetPasswordForm.formState.errors.newPassword}
            helperText={resetPasswordForm.formState.errors.newPassword?.message}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            {...resetPasswordForm.register('confirmPassword')}
            error={!!resetPasswordForm.formState.errors.confirmPassword}
            helperText={resetPasswordForm.formState.errors.confirmPassword?.message}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default PasswordReset; 