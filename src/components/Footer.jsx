import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#333', color: 'white', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <span role="img" aria-label="paw" style={{ fontSize: '2rem', marginRight: '5px' }}>🐾</span>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                PAW<span style={{ color: '#4A90E2' }}>care</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Helping pets find their forever homes and providing resources for pet owners to ensure happy, healthy lives for their furry companions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'white' }}>
                <span role="img" aria-label="facebook">📘</span>
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <span role="img" aria-label="twitter">📱</span>
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <span role="img" aria-label="pinterest">📌</span>
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <span role="img" aria-label="linkedin">📎</span>
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">Home</Link>
              <Link href="/about" color="inherit" underline="hover">About Us</Link>
              <Link href="/pets" color="inherit" underline="hover">Available Pets</Link>
              <Link href="/matching-quiz" color="inherit" underline="hover">Matching Quiz</Link>
              <Link href="/contact" color="inherit" underline="hover">Contact Us</Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>Pet Resources</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" underline="hover">Adoption Process</Link>
              <Link href="#" color="inherit" underline="hover">Pet Care Tips</Link>
              <Link href="#" color="inherit" underline="hover">Training Resources</Link>
              <Link href="#" color="inherit" underline="hover">Pet Health</Link>
              <Link href="#" color="inherit" underline="hover">Success Stories</Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="location" style={{ marginRight: '8px' }}>📍</span> 
                Periyakallar 01, Kallar, Batticaloa
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="phone" style={{ marginRight: '8px' }}>📞</span> 
                +94754830632
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="email" style={{ marginRight: '8px' }}>✉️</span> 
                info@petadoption.com
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="clock" style={{ marginRight: '8px' }}>🕒</span> 
                Mon-Fri: 9AM-5PM, Sat: 10AM-4PM
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} PAWcare Pet Adoption. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
