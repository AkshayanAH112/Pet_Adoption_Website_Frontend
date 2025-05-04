import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Box, 
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';
import { getPets, getMyPets } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

// Styled components
const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

const PetCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 'bold',
  '&.Mui-selected': {
    color: '#4A90E2'
  }
}));

const MoodChip = styled(Chip)(({ mood }) => {
  const moodColors = {
    happy: { bg: '#E8F5E9', color: '#4CAF50' },
    sad: { bg: '#EDE7F6', color: '#673AB7' },
    playful: { bg: '#FFF8E1', color: '#FFC107' },
    sleepy: { bg: '#E1F5FE', color: '#03A9F4' }
  };
  
  return {
    backgroundColor: moodColors[mood]?.bg || '#E0E0E0',
    color: moodColors[mood]?.color || '#757575',
    fontWeight: 'bold',
    fontSize: '0.75rem',
  };
});

const UserProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  // Redirect if not adopter
  useEffect(() => {
    if (user && user.role !== 'adopter') {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'shelter') {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      
      try {
        // Fetch adopted pets - only those adopted by the current user
        const response = await getPets();
        console.log('All pets:', response.data);
        
        // Filter to only show pets adopted by the current user
        const userAdoptedPets = response.data.filter(pet => {
          console.log('Checking pet:', pet.name, 'isAdopted:', pet.isAdopted, 'adoptedBy:', pet.adoptedBy, 'user:', user._id);
          
          return pet.isAdopted && 
            pet.adoptedBy && 
            (pet.adoptedBy === user._id || 
             pet.adoptedBy._id === user._id || 
             (typeof pet.adoptedBy === 'string' && pet.adoptedBy === user.id) ||
             (typeof pet.adoptedBy === 'object' && 
              (pet.adoptedBy._id === user.id || 
               pet.adoptedBy.id === user.id || 
               pet.adoptedBy.id === user._id)));
        });
        
        console.log('User adopted pets:', userAdoptedPets);
        setAdoptedPets(userAdoptedPets);
        
        // In a real app, you would fetch favorites from an API
        // For now, just show some available pets as favorites
        const availablePets = response.data.filter(pet => !pet.isAdopted).slice(0, 3);
        setFavoritePets(availablePets);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Use mock data if API is not available
        setAdoptedPets([
          {
            _id: 'mock1',
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: 3,
            mood: 'happy',
            description: 'Friendly and playful golden retriever who loves long walks.',
            imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
            isAdopted: true,
            adoptionDate: new Date().toISOString()
          }
        ]);
        
        setFavoritePets([
          {
            _id: 'mock2',
            name: 'Whiskers',
            species: 'Cat',
            breed: 'Siamese',
            age: 2,
            mood: 'sleepy',
            description: 'Elegant Siamese cat who enjoys sunbathing and quiet naps.',
            imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
            isAdopted: false
          },
          {
            _id: 'mock3',
            name: 'Hopper',
            species: 'Rabbit',
            breed: 'Holland Lop',
            age: 1,
            mood: 'playful',
            description: 'Energetic rabbit who loves to hop around and eat carrots.',
            imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmFiYml0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
            isAdopted: false
          }
        ]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error in fetchPets:', err);
      setError('Failed to load pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    setOpenEditDialog(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Call the updateUserProfile function from AuthContext
      await updateUserProfile(profileData);
      
      // Close the dialog after successful update
      setOpenEditDialog(false);
      
      // Show success message
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const renderAdoptedPets = () => (
    <Grid container spacing={3}>
      {loading ? (
        <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Grid>
      ) : adoptedPets.length === 0 ? (
        <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            You haven't adopted any pets yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/pets')}
          >
            Find a Pet to Adopt
          </Button>
        </Grid>
      ) : (
        adoptedPets.map(pet => (
          <Grid item xs={12} sm={6} md={4} key={pet._id}>
            <PetCard>
              <CardMedia
                component="img"
                height="200"
                image={pet.imageUrl || 'https://via.placeholder.com/300x200?text=Pet+Image'}
                alt={pet.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {pet.name}
                  </Typography>
                  <MoodChip 
                    label={pet.mood || 'happy'} 
                    mood={pet.mood || 'happy'}
                    size="small"
                    icon={<PetsIcon fontSize="small" />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {pet.species} {pet.breed ? `• ${pet.breed}` : ''} {pet.age ? `• ${pet.age} years` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mb: 1
                }}>
                  {pet.description || 'No description available.'}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label="Adopted" 
                    color="secondary"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  {pet.adoptionDate && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Adopted on: {new Date(pet.adoptionDate).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => navigate(`/pets/${pet._id}`)}
                  fullWidth
                >
                  View Details
                </Button>
              </CardActions>
            </PetCard>
          </Grid>
        ))
      )}
    </Grid>
  );

  const renderFavoritePets = () => (
    <Grid container spacing={3}>
      {loading ? (
        <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Grid>
      ) : favoritePets.length === 0 ? (
        <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            You don't have any favorite pets yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/pets')}
          >
            Browse Pets
          </Button>
        </Grid>
      ) : (
        favoritePets.map(pet => (
          <Grid item xs={12} sm={6} md={4} key={pet._id}>
            <PetCard>
              <CardMedia
                component="img"
                height="200"
                image={pet.imageUrl || 'https://via.placeholder.com/300x200?text=Pet+Image'}
                alt={pet.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {pet.name}
                  </Typography>
                  <MoodChip 
                    label={pet.mood || 'happy'} 
                    mood={pet.mood || 'happy'}
                    size="small"
                    icon={<PetsIcon fontSize="small" />}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {pet.species} {pet.breed ? `• ${pet.breed}` : ''} {pet.age ? `• ${pet.age} years` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mb: 1
                }}>
                  {pet.description || 'No description available.'}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={pet.isAdopted ? "Adopted" : "Available"} 
                    color={pet.isAdopted ? "secondary" : "success"}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => navigate(`/pets/${pet._id}`)}
                  fullWidth
                >
                  View Details
                </Button>
              </CardActions>
            </PetCard>
          </Grid>
        ))
      )}
    </Grid>
  );

  if (!user) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Access Denied</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You need to be logged in to view your profile.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: '#f9f9f9', py: 4, minHeight: 'calc(100vh - 64px - 200px)' }}>
        <Container maxWidth="lg">
          {/* Profile Header */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ProfileCard>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        bgcolor: '#4A90E2',
                        mb: 2
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {user.name || 'Pet Lover'}
                    </Typography>
                    <Chip 
                      label="Pet Adopter" 
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  
                  {user.phone && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{user.phone}</Typography>
                    </Box>
                  )}
                  
                  {user.address && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                      <Typography variant="body1">{user.address}</Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      startIcon={<EditIcon />}
                      fullWidth
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      fullWidth
                      onClick={logout}
                      sx={{ mt: 2 }}
                    >
                      Logout
                    </Button>
                  </Box>
                </ProfileCard>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <ProfileCard>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
                      <StyledTab 
                        label="My Adopted Pets" 
                        icon={<PetsIcon />} 
                        iconPosition="start"
                      />
                      <StyledTab 
                        label="Favorite Pets" 
                        icon={<FavoriteIcon />} 
                        iconPosition="start"
                      />
                    </Tabs>
                  </Box>
                  
                  {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                  
                  {activeTab === 0 ? renderAdoptedPets() : renderFavoritePets()}
                </ProfileCard>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
      
      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            multiline
            rows={3}
            value={profileData.address}
            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfilePage;
