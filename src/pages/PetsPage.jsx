import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoodIcon from '@mui/icons-material/Mood';
import { getPets } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PetCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
  },
  borderRadius: '12px',
  overflow: 'hidden'
}));

const PetImage = styled(CardMedia)(({ theme }) => ({
  paddingTop: '75%', // 4:3 aspect ratio
  position: 'relative'
}));

const AdoptedOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1
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
    fontWeight: 'bold',
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1
  };
});

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'my-pets', 'available', 'adopted'
  const { user } = useAuth();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await getPets();
        setPets(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError('Failed to load pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const filteredPets = () => {
    switch (filter) {
      case 'my-pets':
        return pets.filter(pet => pet.supplier === user?.id);
      case 'available':
        return pets.filter(pet => !pet.isAdopted);
      case 'adopted':
        return pets.filter(pet => pet.isAdopted);
      default:
        return pets;
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: 'calc(100vh - 64px - 200px)' }}>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
              <PetsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Pet Gallery
            </Typography>
            
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Filter Pets</InputLabel>
              <Select
                value={filter}
                onChange={handleFilterChange}
                label="Filter Pets"
              >
                <MenuItem value="all">All Pets</MenuItem>
                {user && user.role === 'shelter' && (
                  <MenuItem value="my-pets">My Pets</MenuItem>
                )}
                <MenuItem value="available">Available for Adoption</MenuItem>
                <MenuItem value="adopted">Already Adopted</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ py: 4 }}>
              {error}
            </Typography>
          ) : filteredPets().length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="textSecondary">
                No pets found matching your criteria.
              </Typography>
              {filter === 'my-pets' && user?.role === 'shelter' && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  href="/add-pet"
                >
                  Add Your First Pet
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={4}>
              {filteredPets().map((pet) => (
                <Grid item key={pet._id} xs={12} sm={6} md={4}>
                  <PetCard>
                    <Box sx={{ position: 'relative' }}>
                      <PetImage
                        image={pet.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                        title={pet.name}
                      />
                      <MoodChip 
                        mood={pet.mood} 
                        label={pet.mood?.charAt(0).toUpperCase() + pet.mood?.slice(1)} 
                        icon={<MoodIcon />}
                      />
                      {pet.isAdopted && (
                        <AdoptedOverlay>
                          <Chip 
                            label="Adopted" 
                            color="secondary" 
                            icon={<FavoriteIcon />}
                            sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, px: 1 }}
                          />
                        </AdoptedOverlay>
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        {pet.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={pet.species} size="small" color="primary" />
                        {pet.breed && <Chip label={pet.breed} size="small" variant="outlined" />}
                        {pet.age && <Chip label={`${pet.age} years old`} size="small" variant="outlined" />}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {pet.description?.length > 100 
                          ? `${pet.description.substring(0, 100)}...` 
                          : pet.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        href={`/pets/${pet._id}`}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </PetCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PetsPage;
