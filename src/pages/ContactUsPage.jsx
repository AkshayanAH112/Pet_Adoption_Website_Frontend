import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Styled components
const ContactCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  }
}));

const IconBox = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    color: color || theme.palette.primary.main,
    marginRight: theme.spacing(2),
    fontSize: 28,
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Here you would normally send the data to your backend
      console.log('Form submitted:', formData);
      
      // Show success message
      setSnackbarMessage('Your message has been sent. We will get back to you soon!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } else {
      setSnackbarMessage('Please correct the errors in the form.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: '#f9f9f9', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Have questions about pet adoption or want to get involved? We're here to help!
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <ContactCard>
                <CardContent>
                  <IconBox color="#4A90E2">
                    <LocationOnIcon />
                    <Typography variant="h6" component="h3">
                      Our Location
                    </Typography>
                  </IconBox>
                  <Typography variant="body1" paragraph>
                    Periyakallar 01
                  </Typography>
                  <Typography variant="body1">
                    Kallar, Batticaloa
                  </Typography>
                </CardContent>
              </ContactCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <ContactCard>
                <CardContent>
                  <IconBox color="#4CAF50">
                    <PhoneIcon />
                    <Typography variant="h6" component="h3">
                      Phone Number
                    </Typography>
                  </IconBox>
                  <Typography variant="body1" paragraph>
                    +94 754 830 632
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Available 7 days a week
                  </Typography>
                </CardContent>
              </ContactCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <ContactCard>
                <CardContent>
                  <IconBox color="#FF6B6B">
                    <EmailIcon />
                    <Typography variant="h6" component="h3">
                      Email Address
                    </Typography>
                  </IconBox>
                  <Typography variant="body1" paragraph>
                    info@petadoption.com
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    We respond within 24 hours
                  </Typography>
                </CardContent>
              </ContactCard>
            </Grid>
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={12} md={5}>
              <StyledPaper>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Opening Hours
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <IconBox>
                    <AccessTimeIcon />
                    <Typography variant="h6" component="h3">
                      Visit Us
                    </Typography>
                  </IconBox>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Monday - Friday
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        9:00 AM - 5:00 PM
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Saturday
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        10:00 AM - 4:00 PM
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Sunday
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        Closed
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Follow Us
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Stay connected with us on social media for updates on new arrivals, success stories, and events.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Social media icons would go here */}
                </Box>
              </StyledPaper>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <StyledPaper>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  Send Us a Message
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={!!errors.subject}
                        helperText={errors.subject}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        sx={{ 
                          py: 1.5, 
                          px: 4,
                          borderRadius: '50px'
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </StyledPaper>
            </Grid>
          </Grid>
          
          {/* Google Maps embed would go here */}
          <Box sx={{ mt: 6, height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.575330733257!2d81.52291491477258!3d7.710283494438611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afacd5a1c3d3183%3A0x5c99abb59bc7a80b!2sKallar%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
          </Box>
        </Container>
      </Box>
      
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      <Footer />
    </>
  );
};

export default ContactUsPage;
