import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Modal,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import MoodIcon from '@mui/icons-material/Mood';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';
import { getPetById, adoptPet, deletePet } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdoptionCertificate from '../components/AdoptionCertificate';

const PetImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 400,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
}));

const MoodChip = styled(Chip)(({ mood, theme }) => {
  const moodColors = {
    happy: '#4caf50',
    sad: '#f44336',
    playful: '#2196f3',
    sleepy: '#ff9800'
  };
  
  return {
    backgroundColor: moodColors[mood] || '#757575',
    color: '#fff',
    fontWeight: 'bold'
  };
});

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess } = useNotification();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adoptLoading, setAdoptLoading] = useState(false);
  const [adoptSuccess, setAdoptSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const response = await getPetById(id);
        setPet(response.data);
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError('Failed to load pet details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleAdopt = async () => {
    try {
      setAdoptLoading(true);
      await adoptPet(id);
      setAdoptSuccess(true);
      
      // Show confetti animation
      setShowConfetti(true);
      
      // Update pet data
      const response = await getPetById(id);
      setPet(response.data);
      
      // Show success notification
      showSuccess(`Congratulations! You've successfully adopted ${pet.name}!`);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
        // Show certificate after confetti
        setShowCertificate(true);
      }, 5000);
    } catch (err) {
      console.error('Error adopting pet:', err);
      setError('Failed to adopt pet. Please try again later.');
    } finally {
      setAdoptLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      await deletePet(id);
      navigate('/pets');
    } catch (err) {
      console.error('Error deleting pet:', err);
      setError('Failed to delete pet. Please try again later.');
    }
  };

  const isOwner = user && pet && user.id === pet.supplier;

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px - 200px)' }}>
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container sx={{ py: 8, minHeight: 'calc(100vh - 64px - 200px)' }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/pets')}
            sx={{ mt: 2 }}
          >
            Back to Pets
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  if (!pet) {
    return (
      <>
        <Navbar />
        <Container sx={{ py: 8, minHeight: 'calc(100vh - 64px - 200px)' }}>
          <Alert severity="warning">Pet not found</Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/pets')}
            sx={{ mt: 2 }}
          >
            Back to Pets
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: 'calc(100vh - 64px - 200px)' }}>
        <Container>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => navigate('/pets')}
              sx={{ mr: 2 }}
              aria-label="back to pets"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
              {pet.name}
            </Typography>
          </Box>
          
          {adoptSuccess && (
            <Alert severity="success" sx={{ mb: 4 }}>
              Congratulations! You've successfully adopted {pet.name}!
            </Alert>
          )}
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <PetImage>
                <img 
                  src={pet.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'} 
                  alt={pet.name} 
                />
              </PetImage>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 4, height: '100%', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      icon={<PetsIcon />} 
                      label={pet.species?.charAt(0).toUpperCase() + pet.species?.slice(1)} 
                      color="primary" 
                    />
                    <MoodChip 
                      mood={pet.mood} 
                      icon={<MoodIcon />} 
                      label={pet.mood?.charAt(0).toUpperCase() + pet.mood?.slice(1)} 
                    />
                  </Box>
                  
                  {pet.isAdopted && (
                    <Chip 
                      icon={<FavoriteIcon />} 
                      label="Adopted" 
                      color="secondary" 
                    />
                  )}
                </Box>
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  About {pet.name}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {pet.breed && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Breed</Typography>
                      <Typography variant="body1">{pet.breed}</Typography>
                    </Grid>
                  )}
                  
                  {pet.age && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Age</Typography>
                      <Typography variant="body1">{pet.age} years</Typography>
                    </Grid>
                  )}
                </Grid>
                
                <Typography variant="body1" paragraph>
                  {pet.description || 'No description available for this pet.'}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Added on {new Date(pet.createdAt).toLocaleDateString()}
                    </Typography>
                    
                    {pet.isAdopted && pet.adoptionDate && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <FavoriteIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                        Adopted on {new Date(pet.adoptionDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                  
                  {isOwner && (
                    <Box>
                      <IconButton 
                        color="primary" 
                        onClick={() => navigate(`/edit-pet/${pet._id}`)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={handleDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                
                {!pet.isAdopted && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={adoptLoading}
                    onClick={handleAdopt}
                    sx={{ 
                      py: 1.5,
                      backgroundColor: '#4caf50',
                      '&:hover': {
                        backgroundColor: '#388e3c'
                      }
                    }}
                  >
                    {adoptLoading ? <CircularProgress size={24} /> : 'Adopt Me!'}
                  </Button>
                )}
                
                {deleteConfirm && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Are you sure you want to delete this pet? This action cannot be undone.
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button size="small" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                      <Button size="small" color="error" onClick={handleDelete}>Delete</Button>
                    </Box>
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
      
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 9999
            }}
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <Box
                key={i}
                component={motion.div}
                sx={{
                  position: 'absolute',
                  width: Math.random() * 20 + 5,
                  height: Math.random() * 20 + 5,
                  backgroundColor: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'][Math.floor(Math.random() * 16)],
                  borderRadius: '50%',
                }}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  rotate: Math.random() * 360,
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </Box>
        )}
      </AnimatePresence>
      
      {/* Adoption Certificate Modal */}
      <Modal
        open={showCertificate}
        onClose={() => setShowCertificate(false)}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Fade in={showCertificate}>
          <Box sx={{ 
            maxWidth: '90vw', 
            maxHeight: '90vh', 
            overflow: 'auto',
            backgroundColor: 'white',
            borderRadius: 2,
            p: 2
          }}>
            <AdoptionCertificate 
              pet={pet} 
              adopter={user} 
              adoptionDate={pet?.adoptionDate || new Date()} 
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default PetDetailPage;
