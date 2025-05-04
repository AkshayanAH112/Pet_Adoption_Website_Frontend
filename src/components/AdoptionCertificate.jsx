import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';
import PetsIcon from '@mui/icons-material/Pets';
import { useNotification } from '../context/NotificationContext';

const CertificateContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.spacing(2),
  position: 'relative',
  width: '100%',
  maxWidth: '800px',
  minHeight: '600px',
  margin: '0 auto',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  border: '10px solid #f4a261',
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const PawPrint = styled('div')(({ theme, position }) => ({
  position: 'absolute',
  width: '60px',
  height: '60px',
  ...position,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    background: '#f4a261',
    opacity: 0.6,
    borderRadius: '50%'
  },
  '&::before': {
    width: '60px',
    height: '60px',
    top: '0',
    left: '0'
  },
  '&::after': {
    width: '25px',
    height: '25px',
    top: '-15px',
    left: '20px',
    boxShadow: '-25px 15px 0 #f4a261, -10px 35px 0 #f4a261, 15px 35px 0 #f4a261'
  }
}));

const AdoptionCertificate = ({ pet, adopter, adoptionDate }) => {
  const { showSuccess } = useNotification();
  const [signature, setSignature] = useState('');
  
  const formattedDate = new Date(adoptionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const printCertificate = () => {
    window.print();
    showSuccess('Certificate ready for printing!');
  };
  
  // Set default signature to adopter's name if available
  useEffect(() => {
    if (adopter?.username) {
      setSignature(adopter.username);
    }
  }, [adopter]);

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ position: 'relative' }}>
        <CertificateContainer className="print-section">
          {/* Decorative paw prints */}
          <PawPrint position={{ top: '20px', left: '20px', transform: 'rotate(-30deg)' }} />
          <PawPrint position={{ top: '20px', right: '20px', transform: 'rotate(30deg)' }} />
          <PawPrint position={{ bottom: '20px', left: '20px', transform: 'rotate(30deg)' }} />
          <PawPrint position={{ bottom: '20px', right: '20px', transform: 'rotate(-30deg)' }} />
          
          {/* Certificate header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" sx={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#e76f51',
              fontWeight: 'bold',
              mb: 1
            }}>
              CERTIFICATE
            </Typography>
            <Typography variant="h4" component="h2" sx={{ 
              fontFamily: 'Arial, sans-serif',
              color: '#e76f51',
              fontWeight: 'bold',
              mb: 3
            }}>
              OF ADOPTION
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              color: '#6d4c41', 
              fontWeight: 'medium',
              mb: 4
            }}>
              THIS CERTIFIES THAT
            </Typography>
          </Box>
          
          {/* Adopter Name */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ 
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              color: '#6d4c41',
              borderBottom: '2px solid #e76f51',
              display: 'inline-block',
              px: 4,
              py: 1
            }}>
              {adopter?.username || 'New Pet Parent'}
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" sx={{ 
            textAlign: 'center',
            color: '#6d4c41',
            mb: 3
          }}>
            OFFICIALLY ADOPTED
          </Typography>
          
          {/* Pet Name */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ 
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              color: '#6d4c41',
              borderBottom: '2px solid #e76f51',
              display: 'inline-block',
              px: 4,
              py: 1
            }}>
              {pet?.name || 'Lovely Pet'}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ 
            textAlign: 'center',
            color: '#6d4c41',
            fontWeight: 'medium',
            mb: 1
          }}>
            I PROMISE TO LOVE AND CARE
          </Typography>
          
          <Typography variant="body1" sx={{ 
            textAlign: 'center',
            color: '#6d4c41',
            fontWeight: 'medium',
            mb: 5
          }}>
            FOR MY NEW PET!
          </Typography>
          
          {/* Date and Signature */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mt: 'auto' }}>
            <Box sx={{ textAlign: 'center', width: '40%' }}>
              <Typography variant="body1" sx={{ 
                borderTop: '1px solid #6d4c41',
                pt: 1,
                color: '#6d4c41'
              }}>
                {formattedDate}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6d4c41' }}>
                DATE
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', width: '40%' }}>
              <Typography variant="body1" sx={{ 
                borderTop: '1px solid #6d4c41',
                pt: 1,
                color: '#6d4c41'
              }}>
                {signature}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6d4c41' }}>
                SIGNATURE
              </Typography>
            </Box>
          </Box>
        </CertificateContainer>
        
        {/* Editable signature field - only visible before printing */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: '60px', 
          right: '100px',
          width: '200px',
          '@media print': {
            display: 'none'
          }
        }}>
          <TextField
            label="Your Signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            variant="standard"
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PrintIcon />}
          onClick={printCertificate}
          size="large"
        >
          Print Certificate
        </Button>
      </Box>
    </Box>
  );
};

export default AdoptionCertificate;
