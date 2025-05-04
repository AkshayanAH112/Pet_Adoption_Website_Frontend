import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Container, Box, Grid, Card, CardContent, CardMedia, CircularProgress, Chip, IconButton } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import MoodIcon from '@mui/icons-material/Mood';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import { getPets } from '../services/api';

// Import pet images from assets folder
import dogImage from '../assets/images/dog.jpg';
import catImage from '../assets/images/cat.jpg';
import rabbitImage from '../assets/images/rabbit.jpg';
import heroImage1 from '../assets/images/hero-dogs.jpg';
import heroImage2 from '../assets/images/hero-dogs2.jpg';
import heroImage3 from '../assets/images/hero-dogs3.jpg';

// Hero slider data
const heroSlides = [
  {
    image: heroImage1,
    title: 'Love, Care your Pet',
    description: 'People love pets same as their child. A pet better products needed to keep a pet healthy and happy with care services.',
    buttonText: 'LEARN MORE',
    buttonLink: '/pets'
  },
  {
    image: heroImage2,
    title: 'Find Your Perfect Companion',
    description: 'Discover your ideal pet match and bring joy to your home with our adoption services.',
    buttonText: 'BROWSE PETS',
    buttonLink: '/pets'
  },
  {
    image: heroImage3,
    title: 'Give a Pet a Forever Home',
    description: 'Every pet deserves a loving family. Be the one who makes a difference in their life.',
    buttonText: 'ADOPT NOW',
    buttonLink: '/matching-quiz'
  }
];

// Placeholder images in case pet has no image
const placeholderImages = {
  dog: dogImage,
  cat: catImage,
  rabbit: rabbitImage,
  bird: catImage,  // Using cat image as placeholder for birds
  fish: rabbitImage, // Using rabbit image as placeholder for fish
  other: dogImage,  // Using dog image as placeholder for other species
};

const HomePage = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const featuredPetsRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        setLoading(true);
        // Fetch the 5 latest pets
        const response = await getPets({ limit: 5, sort: 'createdAt', order: 'desc' });
        setFeaturedPets(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured pets:', err);
        setError('Failed to load featured pets');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPets();
  }, []);
  
  // Set up autoplay for the featured pets carousel
  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
      
      // Only start autoplay if there are pets and autoplay is enabled
      if (featuredPets.length > 0 && autoplay) {
        autoplayIntervalRef.current = setInterval(() => {
          if (featuredPetsRef.current) {
            // Move to the next pet or loop back to the first one
            const nextIndex = (currentIndex + 1) % featuredPets.length;
            setCurrentIndex(nextIndex);
            
            // Scroll to the next pet
            featuredPetsRef.current.scrollTo({
              left: nextIndex * 320, // Approximate width of each item including gap
              behavior: 'smooth'
            });
          }
        }, 5000); // Change slide every 5 seconds
      }
    };
    
    startAutoplay();
    
    // Clean up interval on unmount
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [featuredPets, currentIndex, autoplay]);

  // Get appropriate placeholder image based on pet species
  const getPlaceholderImage = (species) => {
    const speciesLower = species?.toLowerCase() || 'other';
    return placeholderImages[speciesLower] || placeholderImages.other;
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Slider */}
      <HeroSlider slides={heroSlides} />
      
      {/* Featured Pets Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Featured Pets
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '700px', mx: 'auto' }}>
            Meet some of our wonderful pets looking for their forever homes. Each one has a unique personality and story.
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : featuredPets.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Typography variant="body1">No pets available at the moment. Check back soon!</Typography>
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            {/* Left Arrow */}
            <IconButton 
              sx={{ 
                position: 'absolute', 
                left: -20, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
              onClick={() => {
                // Pause autoplay when user interacts with arrows
                setAutoplay(false);
                
                if (featuredPetsRef.current) {
                  featuredPetsRef.current.scrollBy({ left: -320, behavior: 'smooth' });
                  if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                  }
                }
              }}
              disabled={currentIndex === 0}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            
            {/* Right Arrow */}
            <IconButton 
              sx={{ 
                position: 'absolute', 
                right: -20, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
              onClick={() => {
                // Pause autoplay when user interacts with arrows
                setAutoplay(false);
                
                if (featuredPetsRef.current) {
                  featuredPetsRef.current.scrollBy({ left: 320, behavior: 'smooth' });
                  if (currentIndex < featuredPets.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                  }
                }
              }}
              disabled={currentIndex >= featuredPets.length - 1}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
            
            <Box 
              ref={featuredPetsRef}
              sx={{ 
                display: 'flex',
                overflowX: 'auto',
                scrollbarWidth: 'none',  /* Firefox */
                '&::-webkit-scrollbar': { display: 'none' }, /* Chrome */
                gap: 3,
                pb: 2,
                scrollSnapType: 'x mandatory',
                '& > *': {
                  scrollSnapAlign: 'start'
                }
              }}
              onScroll={(e) => {
                // Pause autoplay when user manually scrolls
                setAutoplay(false);
                
                // Update current index based on scroll position
                if (featuredPetsRef.current) {
                  const scrollLeft = e.target.scrollLeft;
                  const itemWidth = 320; // approximate width of each item including gap
                  const newIndex = Math.round(scrollLeft / itemWidth);
                  if (newIndex !== currentIndex) {
                    setCurrentIndex(newIndex);
                  }
                }
              }}
              onMouseEnter={() => setAutoplay(false)} // Pause on hover
              onMouseLeave={() => setAutoplay(true)} // Resume on mouse leave
            >
            {featuredPets.map((pet, index) => (
              <Box 
                key={pet._id}
                sx={{ 
                  minWidth: '300px',
                  maxWidth: '300px',
                  animation: `fadeInSlide 0.5s ease-out ${index * 0.2}s both`,
                  '@keyframes fadeInSlide': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(20px)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={pet.imageUrl || getPlaceholderImage(pet.species)}
                      alt={pet.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    {pet.mood && (
                      <Chip
                        icon={<MoodIcon />}
                        label={pet.mood.charAt(0).toUpperCase() + pet.mood.slice(1)}
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: pet.mood === 'happy' ? '#4caf50' :
                                          pet.mood === 'sad' ? '#f44336' :
                                          pet.mood === 'playful' ? '#2196f3' :
                                          pet.mood === 'sleepy' ? '#ff9800' : '#757575',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                    {pet.isAdopted && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Chip
                          icon={<FavoriteIcon />}
                          label="Adopted"
                          sx={{ backgroundColor: '#e91e63', color: 'white', fontWeight: 'bold' }}
                        />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                      {pet.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={pet.species?.charAt(0).toUpperCase() + pet.species?.slice(1)} 
                        size="small" 
                        color="primary" 
                      />
                      {pet.breed && <Chip label={pet.breed} size="small" variant="outlined" />}
                      {pet.age && <Chip label={`${pet.age} years old`} size="small" variant="outlined" />}
                    </Box>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        backgroundColor: '#4A90E2', 
                        '&:hover': { backgroundColor: '#3570b4' } 
                      }}
                      component={Link}
                      to={`/pets/${pet._id}`}
                      disabled={pet.isAdopted}
                    >
                      {pet.isAdopted ? 'Already Adopted' : 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
            </Box>
          </Box>
        )}
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            sx={{ 
              borderColor: '#4A90E2', 
              color: '#4A90E2', 
              borderRadius: '50px', 
              px: 4, 
              py: 1.5,
              '&:hover': {
                borderColor: '#3570b4',
                backgroundColor: 'rgba(74, 144, 226, 0.1)'
              }
            }}
            component={Link}
            to="/pets"
          >
            View All Pets
          </Button>
        </Box>
      </Container>
      
      {/* How It Works Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              How Pet Adoption Works
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', maxWidth: '700px', mx: 'auto' }}>
              Our simple process makes it easy to find the perfect companion for your home.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  backgroundColor: '#4A90E2', 
                  borderRadius: '50%', 
                  width: '80px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <PetsIcon sx={{ fontSize: '40px', color: 'white' }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Browse Pets
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  View available pets and their unique stories. Filter by type, age, and other characteristics to find your perfect match.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  backgroundColor: '#F2D335', 
                  borderRadius: '50%', 
                  width: '80px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <FavoriteIcon sx={{ fontSize: '40px', color: 'white' }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Meet & Connect
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Learn about each pet's personality, needs, and background. Take our matching quiz to find pets that match your lifestyle.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  backgroundColor: '#FF6B6B', 
                  borderRadius: '50%', 
                  width: '80px', 
                  height: '80px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <HomeIcon sx={{ fontSize: '40px', color: 'white' }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Adopt & Love
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Complete the adoption process and welcome your new pet into their forever home. We provide resources to help with the transition.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#4A90E2', 
                borderRadius: '50px', 
                px: 4, 
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#3570b4'
                }
              }}
              component={Link}
              to="/matching-quiz"
            >
              Take the Matching Quiz
            </Button>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </>
  );
};

export default HomePage;
