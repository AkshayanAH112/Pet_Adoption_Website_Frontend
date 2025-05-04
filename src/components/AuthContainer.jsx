import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import loginPetsImage from '../assets/images/login-pets.jpg';

// Custom styled components
const AuthWrapper = styled(Box)(({ theme }) => ({
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

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: '100vw',
  },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  },
  out: {
    opacity: 0,
    x: '-100vw',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

const AuthContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(location.pathname === '/login' ? 0 : 1);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(newValue === 0 ? '/login' : '/signup');
  };

  return (
    <AuthWrapper>
      <AuthFormContainer>
        {/* Back to Home Button */}
        <Box sx={{ width: '100%', position: 'relative', mb: 2 }}>
          <IconButton 
            onClick={() => navigate('/')}
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
            <TabButton label="Sign In" disableRipple />
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
          {tabValue === 0 ? 'Please sign in to continue' : 'Please sign up to continue'}
        </Typography>
        
        {/* Animated Form Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tabValue}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            style={{ width: '100%' }}
          >
            {tabValue === 0 ? <LoginForm /> : <SignupForm />}
          </motion.div>
        </AnimatePresence>
      </AuthFormContainer>
    </AuthWrapper>
  );
};

export default AuthContainer;
