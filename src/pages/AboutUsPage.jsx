import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Avatar,
  Divider,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroImage from '../assets/slide-02.jpg';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${HeroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  borderRadius: '0 0 20px 20px',
  marginBottom: theme.spacing(6),
  color: 'white',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  }
}));

const TeamMemberCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  margin: 'auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const AboutUsPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection>
        <Container maxWidth="md">
          <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
            <PetsIcon sx={{ fontSize: 30 }} />
          </Avatar>
          <Typography variant="h3" component="h1" gutterBottom>
            About Our Pet Adoption Center
          </Typography>
          <Typography variant="h6" paragraph>
            We're dedicated to finding loving homes for pets in need and connecting people with their perfect companions.
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* Our Mission */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            At our Pet Adoption Center in Periyakallar, Batticaloa, we believe every pet deserves a loving home. 
            Our mission is to rescue, rehabilitate, and rehome animals in need while educating the community about responsible pet ownership.
            We strive to create perfect matches between pets and adopters, ensuring lifelong companionship and happiness for both.
          </Typography>
        </Box>

        {/* Values */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
            Our Values
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <StyledPaper>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#4CAF50', mb: 2 }}>
                  <PetsIcon />
                </Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  Compassion
                </Typography>
                <Typography>
                  We treat every animal with kindness, respect, and the highest standard of care, ensuring their physical and emotional well-being.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledPaper>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#FF6B6B', mb: 2 }}>
                  <FavoriteIcon />
                </Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  Commitment
                </Typography>
                <Typography>
                  We are dedicated to finding the perfect home for every pet, no matter how long it takes, and supporting adopters throughout the process.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledPaper>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#FFB74D', mb: 2 }}>
                  <VolunteerActivismIcon />
                </Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  Community
                </Typography>
                <Typography>
                  We believe in building a strong network of animal lovers, volunteers, and supporters to create lasting change for animals in need.
                </Typography>
              </StyledPaper>
            </Grid>
          </Grid>
        </Box>

        {/* Our Story */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
            Our Story
          </Typography>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="400"
                image="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
                alt="Dogs and cats together"
                sx={{ borderRadius: '12px' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Founded in 2020, our Pet Adoption Center began as a small rescue operation in Periyakallar, Batticaloa. What started with a handful of dedicated volunteers has grown into a comprehensive adoption center serving the entire region.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Over the years, we've rescued hundreds of animals from abandonment, abuse, and neglect, giving them a second chance at life. Our team works tirelessly to rehabilitate these animals and find them loving forever homes.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                Today, we continue to expand our services, offering not just adoption but also education, spay/neuter programs, and community outreach to improve the lives of animals throughout Batticaloa.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* Team section */}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4 }}>
            Our Team
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 6 }}>
            Meet the dedicated individuals who make our mission possible. Our team combines expertise in animal care, veterinary medicine, and shelter management to provide the best possible outcomes for our animals.
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <TeamMemberCard>
                <CardMedia
                  component="img"
                  height="240"
                  image="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80"
                  alt="Team member"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Sarah Johnson
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Founder & Director
                  </Typography>
                </CardContent>
              </TeamMemberCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TeamMemberCard>
                <CardMedia
                  component="img"
                  height="240"
                  image="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80"
                  alt="Team member"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    David Chen
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Veterinarian
                  </Typography>
                </CardContent>
              </TeamMemberCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TeamMemberCard>
                <CardMedia
                  component="img"
                  height="240"
                  image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  alt="Team member"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Maya Patel
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Adoption Coordinator
                  </Typography>
                </CardContent>
              </TeamMemberCard>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default AboutUsPage;
