import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Box, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Slide,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Styled components
const QuizContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '8px',
    background: 'linear-gradient(90deg, #4A90E2 0%, #81C784 50%, #FF8A65 100%)',
  }
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
}));

const OptionCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  backgroundColor: selected ? 'rgba(74, 144, 226, 0.08)' : theme.palette.background.paper,
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: selected ? 'rgba(74, 144, 226, 0.12)' : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  }
}));

const PetCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  }
}));

const StepIcon = styled(Avatar)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  width: 40,
  height: 40,
  marginRight: theme.spacing(2),
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontWeight: 'bold',
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: theme.palette.primary.main,
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: theme.palette.success.main,
  }
}));

const MatchingQuizPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    lifestyle: '',
    homesize: '',
    energylevel: '',
    socialpreference: '',
    timeavailable: ''
  });
  const [matchedPets, setMatchedPets] = useState([]);
  const { user } = useAuth();

  const steps = [
    'Lifestyle',
    'Home Size',
    'Energy Level',
    'Social Preference',
    'Time Available'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAnswer = (field, value) => {
    // Update the answers
    setQuizAnswers(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If not the last step, automatically advance to the next question after a short delay
    if (activeStep < steps.length - 1) {
      // Set a small timeout to allow the selection to be visible before advancing
      setTimeout(() => {
        setActiveStep(prevStep => prevStep + 1);
      }, 500); // 500ms delay for a smooth transition
    }
    
    console.log('Updated answers:', { ...quizAnswers, [field]: value });
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.post('/api/matching/quiz', quizAnswers, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMatchedPets(response.data.matchedPets);
      setActiveStep(steps.length);
    } catch (error) {
      console.error('Quiz submission error:', error);
    }
  };

  // Helper function to get step icon and color
  const getStepIcon = (step) => {
    switch (step) {
      case 0: return { icon: <HomeIcon />, color: '#4A90E2', title: 'Lifestyle' };
      case 1: return { icon: <HomeIcon />, color: '#5C6BC0', title: 'Home Size' };
      case 2: return { icon: <DirectionsRunIcon />, color: '#66BB6A', title: 'Energy Level' };
      case 3: return { icon: <PeopleIcon />, color: '#FFA726', title: 'Social Preference' };
      case 4: return { icon: <AccessTimeIcon />, color: '#EF5350', title: 'Time Available' };
      default: return { icon: <PetsIcon />, color: '#9C27B0', title: 'Results' };
    }
  };

  // Get descriptions for each option
  const getOptionDescription = (field, value) => {
    const descriptions = {
      lifestyle: {
        apartment: 'You live in an apartment or have limited outdoor space.',
        house: 'You have a house with a yard or access to outdoor space.'
      },
      homeSize: {
        small: 'Your living space is compact and cozy.',
        large: 'You have plenty of room for a pet to move around.'
      },
      energyLevel: {
        high: 'You enjoy an active lifestyle and regular exercise.',
        low: 'You prefer a more relaxed, laid-back lifestyle.'
      },
      socialPreference: {
        high: 'You enjoy socializing and having company around.',
        low: 'You value independence and quiet time.'
      },
      timeAvailable: {
        plenty: 'You have lots of time to dedicate to a pet.',
        limited: 'Your schedule is busy with limited free time.'
      }
    };
    
    return descriptions[field]?.[value] || '';
  };

  // Render option cards instead of radio buttons
  const renderOptionCard = (field, value, label, selected) => {
    const description = getOptionDescription(field, value);
    
    return (
      <Grid item xs={12} md={6} key={value}>
        <OptionCard 
          selected={selected} 
          onClick={() => handleAnswer(field, value)}
          elevation={selected ? 3 : 1}
        >
          <Box sx={{ p: 1 }}>
            <StyledRadio checked={selected} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{label}</Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">{description}</Typography>
            )}
          </Box>
        </OptionCard>
      </Grid>
    );
  };

  const renderStepContent = (step) => {
    const { icon, color, title } = getStepIcon(step);
    
    switch (step) {
      case 0:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StepIcon color={color}>{icon}</StepIcon>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Tell us about your living situation to help us find pets that will thrive in your environment.
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {renderOptionCard('lifestyle', 'apartment', 'Apartment Living', quizAnswers.lifestyle === 'apartment')}
              {renderOptionCard('lifestyle', 'house', 'House with Yard', quizAnswers.lifestyle === 'house')}
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StepIcon color={color}>{icon}</StepIcon>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Different pets need different amounts of space. How would you describe your home?
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {renderOptionCard('homesize', 'small', 'Small Space', quizAnswers.homesize === 'small')}
              {renderOptionCard('homesize', 'large', 'Large Space', quizAnswers.homesize === 'large')}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StepIcon color={color}>{icon}</StepIcon>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Some pets are very energetic while others are more relaxed. What energy level matches your lifestyle?
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {renderOptionCard('energylevel', 'high', 'Very Active', quizAnswers.energylevel === 'high')}
              {renderOptionCard('energylevel', 'low', 'Relaxed', quizAnswers.energylevel === 'low')}
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StepIcon color={color}>{icon}</StepIcon>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Would you prefer a pet that's very social and interactive, or one that's more independent?
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {renderOptionCard('socialpreference', 'high', 'Very Social', quizAnswers.socialpreference === 'high')}
              {renderOptionCard('socialpreference', 'low', 'Independent', quizAnswers.socialpreference === 'low')}
            </Grid>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <StepIcon color={color}>{icon}</StepIcon>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              How much time do you have available to spend with your pet each day?
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {renderOptionCard('timeavailable', 'plenty', 'Lots of Free Time', quizAnswers.timeavailable === 'plenty')}
              {renderOptionCard('timeavailable', 'limited', 'Limited Time', quizAnswers.timeavailable === 'limited')}
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: '#f9f9f9', py: 6, minHeight: 'calc(100vh - 64px - 200px)' }}>
        <Container maxWidth="lg">
          {/* Quiz Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Find Your Perfect Pet Match
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Answer a few questions about your lifestyle and preferences to discover the pets that would be a great fit for you.
            </Typography>
          </Box>

          {/* Main Quiz Container */}
          <QuizContainer>
            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
              {steps.map((label, index) => {
                const stepIconInfo = getStepIcon(index);
                return (
                  <Step key={label}>
                    <StyledStepLabel StepIconProps={{
                      style: { color: activeStep >= index ? stepIconInfo.color : undefined }
                    }}>
                      {label}
                    </StyledStepLabel>
                  </Step>
                );
              })}
            </Stepper>

            {/* Quiz Content */}
            <Box sx={{ mt: 4, minHeight: '300px' }}>
              {activeStep < steps.length ? (
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={300}>
                    <Fade in={true} timeout={400}>
                      <Box>
                        {renderStepContent(activeStep)}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 6 }}>
                          <Button 
                            disabled={activeStep === 0} 
                            onClick={handleBack}
                            variant="outlined"
                            sx={{ px: 3, py: 1.2, borderRadius: '50px' }}
                            startIcon={activeStep > 0 ? <span>←</span> : null}
                          >
                            Back
                          </Button>
                          {activeStep === steps.length - 1 && (
                            <Button 
                              variant="contained" 
                              color="primary"
                              onClick={handleSubmitQuiz}
                              sx={{ px: 4, py: 1.2, borderRadius: '50px', ml: 2 }}
                            >
                              Find My Matches
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Fade>
                  </Slide>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
                    <StepIcon color="#9C27B0"><FavoriteIcon /></StepIcon>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      Your Perfect Pet Matches
                    </Typography>
                  </Box>
                  
                  {matchedPets.length > 0 ? (
                    <>
                      <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 4 }}>
                        Based on your preferences, we've found {matchedPets.length} pets that would be a great match for you!
                      </Typography>
                      <Grid container spacing={3}>
                        {matchedPets.map((pet) => (
                          <Grid item xs={12} sm={6} md={4} key={pet._id}>
                            <PetCard>
                              <CardMedia
                                component="img"
                                height="200"
                                image={pet.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={pet.name}
                                sx={{ objectFit: 'cover' }}
                              />
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                  {pet.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                  <Chip 
                                    label={pet.species} 
                                    size="small" 
                                    color="primary" 
                                  />
                                  {pet.breed && <Chip label={pet.breed} size="small" variant="outlined" />}
                                  {pet.age && <Chip label={`${pet.age} years`} size="small" variant="outlined" />}
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {pet.description?.substring(0, 100)}...
                                </Typography>
                              </CardContent>
                              <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  fullWidth
                                  href={`/pets/${pet._id}`}
                                  sx={{ borderRadius: '50px' }}
                                >
                                  View Details
                                </Button>
                              </CardActions>
                            </PetCard>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                      <Alert severity="info" sx={{ mb: 3 }}>
                        No matching pets found based on your preferences.
                      </Alert>
                      <Typography paragraph>
                        Try adjusting your preferences or check back later as new pets become available.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setActiveStep(0)}
                        sx={{ mt: 2, borderRadius: '50px', px: 3 }}
                      >
                        Start Over
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </QuizContainer>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default MatchingQuizPage;
