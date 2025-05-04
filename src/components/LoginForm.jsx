import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Box, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

// Custom styled components
const FormInput = styled('input')(({ theme }) => ({
  flex: 1,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: '16px',
  padding: '10px',
  '&::placeholder': {
    color: '#aaa'
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(0, 2),
  backgroundColor: '#fff',
  borderRadius: '50px',
  border: '1px solid #ddd',
  '&:focus-within': {
    borderColor: '#4caf50',
    boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
  }
}));

const SocialButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '50px',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0, 1),
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: '#555'
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4caf50',
  color: '#fff',
  borderRadius: '50px',
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold',
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#388e3c'
  }
}));

const LoginForm = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await login(email, password);
      showSuccess('Login successful! Welcome back.');
      // Redirect happens in AuthContext
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Social login implementation
    console.log(`Login with ${provider}`);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      
      <InputContainer>
        <EmailIcon sx={{ color: '#666' }} />
        <FormInput
          placeholder="E-mail / username"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </InputContainer>
      
      <InputContainer>
        <LockIcon sx={{ color: '#666' }} />
        <FormInput
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            sx={{ padding: 0 }}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      </InputContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Link to="/forgot-password" style={{ color: '#4caf50', textDecoration: 'none' }}>
          Forgot Password?
        </Link>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SubmitButton 
          type="submit" 
          fullWidth
          disabled={loading}
          sx={{
            position: 'relative',
            '&.Mui-disabled': {
              backgroundColor: '#4caf50',
              color: '#fff',
              opacity: 0.7
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress 
                size={24} 
                color="inherit" 
                sx={{ 
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-12px'
                }} 
              />
              Logging in...
            </>
          ) : 'Login'}
        </SubmitButton>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 2 }}>
        <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
        <Typography variant="body2" sx={{ mx: 2, color: '#666' }}>
          Or sign in using
        </Typography>
        <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SocialButton onClick={() => handleSocialLogin('Google')}>
          <GoogleIcon />
        </SocialButton>
        <SocialButton onClick={() => handleSocialLogin('Facebook')}>
          <FacebookIcon />
        </SocialButton>
        <SocialButton onClick={() => handleSocialLogin('Twitter')}>
          <TwitterIcon />
        </SocialButton>
      </Box>
    </Box>
  );
};

export default LoginForm;
