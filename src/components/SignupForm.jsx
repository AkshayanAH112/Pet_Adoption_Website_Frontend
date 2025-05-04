import React, { useState } from 'react';
import { Button, Typography, Box, InputAdornment, IconButton, FormControl, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
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

const StyledSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  borderRadius: '50px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ddd'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4caf50'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4caf50',
    boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
  },
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5, 2)
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

const SignupForm = () => {
  const { signup } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'adopter'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await signup(formData.name, formData.email, formData.password, formData.role);
      showSuccess('Registration successful! Welcome to PAWcare.');
      // Redirect happens in AuthContext
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    // Social signup implementation
    console.log(`Signup with ${provider}`);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      
      <InputContainer>
        <PersonIcon sx={{ color: '#666' }} />
        <FormInput
          placeholder="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </InputContainer>
      
      <InputContainer>
        <EmailIcon sx={{ color: '#666' }} />
        <FormInput
          placeholder="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </InputContainer>
      
      <InputContainer>
        <LockIcon sx={{ color: '#666' }} />
        <FormInput
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
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
      
      <InputContainer>
        <LockIcon sx={{ color: '#666' }} />
        <FormInput
          placeholder="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            edge="end"
            sx={{ padding: 0 }}
          >
            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      </InputContainer>
      
      <FormControl fullWidth>
        <StyledSelect
          value={formData.role}
          name="role"
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="adopter">Pet Adopter</MenuItem>
          <MenuItem value="shelter">Shelter/Rescue</MenuItem>
        </StyledSelect>
      </FormControl>
      
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </SubmitButton>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 2 }}>
        <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
        <Typography variant="body2" sx={{ mx: 2, color: '#666' }}>
          Or sign up using
        </Typography>
        <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ddd' }} />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SocialButton onClick={() => handleSocialSignup('Google')}>
          <GoogleIcon />
        </SocialButton>
        <SocialButton onClick={() => handleSocialSignup('Facebook')}>
          <FacebookIcon />
        </SocialButton>
        <SocialButton onClick={() => handleSocialSignup('Twitter')}>
          <TwitterIcon />
        </SocialButton>
      </Box>
    </Box>
  );
};

export default SignupForm;
