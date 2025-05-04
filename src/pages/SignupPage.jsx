import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Button, 
  Typography, 
  Box, 
  IconButton,
  Tab, 
  Tabs,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../context/AuthContext';
import loginPetsImage from '../assets/images/login-pets.jpg';

// Custom styled components
const AuthContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#FFF5DB', // Warm beige background for entire page
  justifyContent: 'center',
  alignItems: 'center'
}));

const AuthFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(6),
  backgroundColor: '#FFF5DB', // Warm beige background
  width: '100%',
  maxWidth: '550px',
  margin: '40px auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: '20px auto',
  }
}));

const FormInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '12px 15px 12px 45px',
  marginBottom: theme.spacing(2),
  border: '1px solid #ddd',
  borderRadius: '50px',
  fontSize: '16px',
  backgroundColor: '#fff',
  '&:focus': {
    outline: 'none',
    borderColor: '#aaa'
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  borderRadius: '50px',
  backgroundColor: '#B5E550', // Light green
  color: '#333',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '16px',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#A3D142'
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#333',
  color: '#fff',
  margin: theme.spacing(0, 1),
  '&:hover': {
    backgroundColor: '#555'
  }
}));

const TabButton = styled(Tab)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#333',
  fontWeight: 'bold',
  borderRadius: '50px',
  padding: theme.spacing(1, 3),
  '&.Mui-selected': {
    backgroundColor: '#555',
    color: '#fff'
  }
}));

const RoleSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  borderRadius: '50px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ddd'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#aaa'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#aaa'
  },
  '& .MuiSelect-select': {
    padding: '12px 15px 12px 45px',
  }
}));

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('adopter');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tabValue, setTabValue] = useState(1);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Log the role value before sending
      console.log('Submitting signup with role:', role);
      await signup(username, email, password, role);
    } catch (err) {
      console.error('Signup error details:', err);
      setError(err.message || 'Signup failed');
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <AuthContainer>
      <AuthFormContainer component="form" onSubmit={handleSubmit}>
        {/* Back to Home Button */}
        <Box sx={{ width: '100%', position: 'relative', mb: 2 }}>
          <IconButton 
            component={Link} 
            to="/" 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)'
              },
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            aria-label="back to home"
          >
            <HomeIcon />
          </IconButton>
        </Box>
        {/* Tabs for Sign In / Sign Up */}
        <Box sx={{ width: '100%', mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              '.MuiTabs-indicator': { display: 'none' },
              backgroundColor: '#e6d7b3',
              borderRadius: '50px',
              padding: '4px',
              marginBottom: '20px'
            }}
          >
            <TabButton label="Sign In" disableRipple component={Link} to="/login" />
            <TabButton label="Sign Up" disableRipple />
          </Tabs>
        </Box>
        
        {/* Pet Image */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <img 
            src={loginPetsImage} 
            alt="Cat and dog" 
            style={{ 
              width: '180px', 
              height: '180px', 
              objectFit: 'cover',
              borderRadius: '50%'
            }} 
          />
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
          Please sign up to continue
        </Typography>
        
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {/* Username Input */}
        <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
          <PersonIcon sx={{ position: 'absolute', left: 15, top: 12, color: '#888', zIndex: 1 }} />
          <FormInput
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Box>
        
        {/* Email Input */}
        <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
          <EmailIcon sx={{ position: 'absolute', left: 15, top: 12, color: '#888', zIndex: 1 }} />
          <FormInput
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        
        {/* Password Input */}
        <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
          <LockIcon sx={{ position: 'absolute', left: 15, top: 12, color: '#888', zIndex: 1 }} />
          <FormInput
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <IconButton
            onClick={togglePasswordVisibility}
            sx={{ position: 'absolute', right: 10, top: 8 }}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Box>
        
        {/* Confirm Password Input */}
        <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
          <LockIcon sx={{ position: 'absolute', left: 15, top: 12, color: '#888', zIndex: 1 }} />
          <FormInput
            placeholder="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <IconButton
            onClick={toggleConfirmPasswordVisibility}
            sx={{ position: 'absolute', right: 10, top: 8 }}
          >
            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Box>
        
        {/* Role Selection */}
        <Box sx={{ position: 'relative', width: '100%', mb: 3 }}>
          <PersonIcon sx={{ position: 'absolute', left: 15, top: 12, color: '#888', zIndex: 1 }} />
          <FormControl fullWidth>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              displayEmpty
              sx={{
                width: '100%',
                padding: '12px 15px 12px 45px',
                borderRadius: '50px',
                fontSize: '16px',
                backgroundColor: '#fff',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ddd'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#aaa'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#aaa'
                }
              }}
            >
              <MenuItem value="adopter">Adopter - I want to adopt a pet</MenuItem>
              <MenuItem value="shelter">Shelter - I want to list pets for adoption</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Sign Up Button */}
        <SubmitButton type="submit">
          Sign up
        </SubmitButton>
        
        {/* Social Login */}
        <Box sx={{ width: '100%', textAlign: 'center', my: 2 }}>
          <Typography variant="body2" sx={{ color: '#888', position: 'relative', mb: 2 }}>
            <span style={{ 
              position: 'relative', 
              backgroundColor: '#FFF5DB', 
              padding: '0 10px', 
              zIndex: 1 
            }}>
              Or sign up using
            </span>
            <span style={{ 
              position: 'absolute', 
              left: 0, 
              right: 0, 
              top: '50%', 
              height: '1px', 
              backgroundColor: '#ddd', 
              zIndex: 0 
            }} />
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <SocialButton>
              <GoogleIcon />
            </SocialButton>
            <SocialButton>
              <FacebookIcon />
            </SocialButton>
            <SocialButton>
              <TwitterIcon />
            </SocialButton>
          </Box>
        </Box>
        
        {/* Sign In Link */}
        <Typography variant="body2" sx={{ mt: 3, color: '#666', textAlign: 'center' }}>
          Already a user? <Link to="/login" style={{ color: '#4A90E2', fontWeight: 'bold' }}>Sign in</Link>
        </Typography>
      </AuthFormContainer>
    </AuthContainer>
  );
};

export default SignupPage;
