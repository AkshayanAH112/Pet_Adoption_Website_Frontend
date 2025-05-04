import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotificationContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '320px',
  padding: theme.spacing(2),
  zIndex: 9999,
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  backgroundColor: '#f8f9fa',
  border: '1px solid #f44336',
  overflow: 'hidden'
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#f44336',
  color: 'white',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: theme.spacing(2)
}));

const MoodChangeNotification = ({ sadPets, onClose }) => {
  const navigate = useNavigate();
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  
  useEffect(() => {
    // Rotate through sad pets every 10 seconds
    if (sadPets.length > 1) {
      const interval = setInterval(() => {
        setCurrentPetIndex(prev => (prev + 1) % sadPets.length);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [sadPets.length]);
  
  if (!sadPets || sadPets.length === 0) return null;
  
  const currentPet = sadPets[currentPetIndex];
  
  return (
    <AnimatePresence>
      <NotificationContainer
        component={motion.div}
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <IconWrapper>
            <MoodBadIcon />
          </IconWrapper>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#f44336' }}>
              Pet Needs Attention
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sadPets.length > 1 ? `${sadPets.length} pets are feeling sad` : 'A pet is feeling sad'}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={onClose}
            sx={{ ml: 1, mt: -1, mr: -1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Box sx={{ pl: 7 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>{currentPet.name}</strong> has been waiting for adoption for too long and is feeling sad.
          </Typography>
          
          <Button 
            size="small" 
            variant="contained" 
            color="primary"
            onClick={() => navigate(`/pets/${currentPet._id}`)}
            sx={{ mt: 1 }}
          >
            View Pet
          </Button>
        </Box>
        
        {sadPets.length > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 2 
          }}>
            {sadPets.map((_, index) => (
              <Box 
                key={index}
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  mx: 0.5,
                  borderRadius: '50%',
                  backgroundColor: index === currentPetIndex ? '#f44336' : '#e0e0e0'
                }}
              />
            ))}
          </Box>
        )}
      </NotificationContainer>
    </AnimatePresence>
  );
};

export default MoodChangeNotification;
