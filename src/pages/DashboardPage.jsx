import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Paper,
  Divider,
  Avatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Tooltip,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoodIcon from '@mui/icons-material/Mood';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getPets, createPet, adoptPet, getCurrentUser, updatePet, deletePet } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Styled components
const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
  }
}));

const StatsCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  borderRadius: '12px',
  backgroundColor: color || '#FFF5DB',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  height: '100%'
}));

const PetCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 'bold',
  '&.Mui-selected': {
    color: '#4A90E2'
  }
}));

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  const [pets, setPets] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [availablePets, setAvailablePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddPetDialog, setOpenAddPetDialog] = useState(false);
  const [openEditPetDialog, setOpenEditPetDialog] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petDescription, setPetDescription] = useState('');
  const [petMood, setPetMood] = useState('happy');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [newPet, setNewPet] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPets();
      // Check current user's role for debugging
      checkCurrentUser();
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getPets();
      setPets(response.data);
      
      // Filter pets based on criteria
      if (user?.role === 'shelter') {
        // Check different possible supplier formats
        const filteredPets = response.data.filter(pet => {
          console.log('Comparing pet supplier:', pet.supplier, 'with user:', user._id, user.id);
          
          if (typeof pet.supplier === 'object' && pet.supplier !== null) {
            return pet.supplier._id === user._id || pet.supplier.id === user._id;
          } else {
            return pet.supplier === user._id || pet.supplier === user.id;
          }
        });
        
        console.log('Filtered pets for shelter:', filteredPets.length);
        setMyPets(filteredPets);
      }
      
      setAdoptedPets(response.data.filter(pet => pet.isAdopted));
      setAvailablePets(response.data.filter(pet => !pet.isAdopted));
      setError(null);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setError('Failed to load pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debug function to check current user's role
  const checkCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      console.log('Current authenticated user:', response.data);
      
      // No need to update role - using proper roles from signup
    } catch (error) {
      console.error('Error checking current user:', error);
    }
  };

  const handleAddPet = async () => {
    try {
      // Check if user has the correct role
      if (!user || user.role !== 'shelter') {
        setSnackbarMessage('You do not have permission to add pets. Only shelter users can add pets for adoption.');
        setSnackbarOpen(true);
        return;
      }
      
      // Validate form
      if (!newPet.name || !newPet.species) {
        setSnackbarMessage('Pet name and species are required');
        setSnackbarOpen(true);
        return;
      }
      
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('name', newPet.name);
      formData.append('species', newPet.species);
      formData.append('breed', newPet.breed);
      formData.append('age', newPet.age);
      formData.append('description', newPet.description);
      formData.append('mood', newPet.mood || 'happy');
      
      if (image) {
        formData.append('image', image);
      }
      
      // Submit the form - either create or update
      if (currentPet) {
        // Update existing pet
        await updatePet(currentPet._id, formData);
        showSuccess('Pet updated successfully!');
      } else {
        // Create new pet
        await createPet(formData);
        showSuccess('Pet added successfully!');
      }
      
      // Close the dialog and reset form
      setOpenAddPetDialog(false);
      setCurrentPet(null);
      setNewPet({
        name: '',
        species: '',
        breed: '',
        age: '',
        description: ''
      });
      setImage(null);
      setImagePreview(null);
      
      // Refresh the pet list
      fetchPets();
    } catch (error) {
      console.error('Error saving pet:', error);
      showError('Failed to save pet. Please try again.');
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  
  // Handle pet adoption
  const handleAdoptPet = async (petId) => {
    try {
      showInfo('Processing adoption request...');
      
      // Call the API to adopt the pet
      await adoptPet(petId);
      
      // Refresh pet lists
      fetchPets();
      
      showSuccess('Pet adopted successfully! Thank you for providing a forever home.');
    } catch (error) {
      console.error('Error adopting pet:', error);
      showError('Failed to adopt pet. Please try again.');
    }
  };

  // Handle add new pet
  const handleAddNewPet = () => {
    // Reset current pet to null to indicate we're adding a new pet
    setCurrentPet(null);
    // Reset form values
    setNewPet({
      name: '',
      species: '',
      breed: '',
      age: '',
      description: '',
      mood: 'happy'
    });
    // Clear image preview and file
    setImagePreview(null);
    setImage(null);
    // Open the dialog
    setOpenAddPetDialog(true);
  };

  // Handle edit pet
  const handleEditPet = (pet) => {
    setCurrentPet(pet);
    // Set form values
    setNewPet({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
      description: pet.description || '',
      mood: pet.mood || 'happy'
    });
    // Set image preview but not the image file itself (can't retrieve the file from URL)
    setImagePreview(pet.imageUrl || null);
    setImage(null); // Reset image file since we can't retrieve it from URL
    setOpenAddPetDialog(true); // Reuse the same dialog for editing
  };

  // Handle delete pet
  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    
    try {
      showInfo('Deleting pet...');
      
      // Call the API to delete the pet
      await deletePet(petId);
      
      // Refresh pet lists
      fetchPets();
      
      showSuccess('Pet deleted successfully!');
    } catch (error) {
      console.error('Error deleting pet:', error);
      showError('Failed to delete pet. Please try again.');
    }
  };
  
  // Styled components for file upload
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleAdopt = async (petId) => {
    try {
      await adoptPet(petId);
      fetchPets();
    } catch (error) {
      console.error('Error adopting pet:', error);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: '#f9f9f9', py: 6, minHeight: 'calc(100vh - 64px - 200px)' }}>
        <Container maxWidth="lg">
          {/* Dashboard Header */}
          <Box sx={{ mb: 5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: user?.role === 'shelter' ? '#4A90E2' : '#F2D335',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {user?.role === 'shelter' ? <PetsIcon sx={{ fontSize: 40 }} /> : <PersonIcon sx={{ fontSize: 40 }} />}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Welcome, {user?.name || user?.username}!
                </Typography>
                <Chip 
                  label={user?.role === 'shelter' ? 'Pet Shelter' : user?.role === 'admin' ? 'Admin' : 'Pet Adopter'} 
                  color={user?.role === 'shelter' ? 'primary' : user?.role === 'admin' ? 'error' : 'secondary'}
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={logout}
                  sx={{ borderRadius: '50px', px: 3 }}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard color="#E3F2FD">
                <Box sx={{ mr: 2, bgcolor: '#2196F3', p: 1.5, borderRadius: '50%' }}>
                  <PetsIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Pets</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{pets.length}</Typography>
                </Box>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard color="#FFF8E1">
                <Box sx={{ mr: 2, bgcolor: '#FFC107', p: 1.5, borderRadius: '50%' }}>
                  <FavoriteIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Adopted</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{adoptedPets.length}</Typography>
                </Box>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard color="#E8F5E9">
                <Box sx={{ mr: 2, bgcolor: '#4CAF50', p: 1.5, borderRadius: '50%' }}>
                  <PetsIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Available</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{availablePets.length}</Typography>
                </Box>
              </StatsCard>
            </Grid>
            {user?.role === 'shelter' && (
              <Grid item xs={12} sm={6} md={3}>
                <StatsCard color="#E0F7FA">
                  <Box sx={{ mr: 2, bgcolor: '#00BCD4', p: 1.5, borderRadius: '50%' }}>
                    <PersonIcon sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">My Pets</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{myPets.length}</Typography>
                  </Box>
                </StatsCard>
              </Grid>
            )}
          </Grid>

          {/* Main Content */}
          <DashboardCard>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs">
                  <StyledTab label="All Pets" icon={<PetsIcon />} iconPosition="start" />
                  {user?.role === 'shelter' && <StyledTab label="My Pets" icon={<PersonIcon />} iconPosition="start" />}
                  <StyledTab label="Available" icon={<FavoriteIcon />} iconPosition="start" />
                  <StyledTab label="Adopted" icon={<MoodIcon />} iconPosition="start" />
                </Tabs>
                
                {user?.role === 'shelter' && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddNewPet()}
                    sx={{ 
                      borderRadius: '50px', 
                      px: 3,
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#388e3c' }
                    }}
                  >
                    Add New Pet
                  </Button>
                )}
              </Box>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
            ) : (
              <Box>
                <Grid container spacing={3}>
                  {/* Filter pets based on active tab */}
                  {(activeTab === 0 ? pets : 
                    activeTab === 1 && user?.role === 'shelter' ? myPets : 
                    activeTab === (user?.role === 'shelter' ? 2 : 1) ? availablePets : 
                    adoptedPets).map(pet => (
                    <Grid item xs={12} sm={6} md={4} key={pet._id}>
                      <PetCard>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={pet.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
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
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
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
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {pet.description?.length > 100 
                              ? `${pet.description.substring(0, 100)}...` 
                              : pet.description || 'No description available.'}
                          </Typography>
                          
                          {/* Show adopter information for shelter users if pet is adopted */}
                          {user?.role === 'shelter' && pet.isAdopted && pet.adoptedBy && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                              <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} /> Adopted By:
                              </Typography>
                              <Typography variant="body2">
                                {typeof pet.adoptedBy === 'object' ? (
                                  <>
                                    <strong>Name:</strong> {pet.adoptedBy.name || pet.adoptedBy.username || 'Anonymous'}<br />
                                    <strong>Email:</strong> {pet.adoptedBy.email || 'No email provided'}<br />
                                    {pet.adoptedBy.phone && <><strong>Phone:</strong> {pet.adoptedBy.phone}<br /></>}
                                    {pet.adoptionDate && <><strong>Date:</strong> {new Date(pet.adoptionDate).toLocaleDateString()}</>}
                                  </>
                                ) : (
                                  'User information not available'
                                )}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          {user?.role === 'shelter' && (activeTab === 1 || ((typeof pet.supplier === 'object' && pet.supplier?._id === user._id) || pet.supplier === user._id)) ? (
                            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                              <Button 
                                size="small" 
                                variant="contained" 
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditPet(pet)}
                                sx={{ flex: 1, mr: 1 }}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="small" 
                                variant="contained" 
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeletePet(pet._id)}
                                sx={{ flex: 1, ml: 1 }}
                              >
                                Delete
                              </Button>
                            </Box>
                          ) : !pet.isAdopted ? (
                            <Button 
                              size="small" 
                              variant="contained" 
                              fullWidth
                              onClick={() => handleAdoptPet(pet._id)}
                              sx={{ 
                                backgroundColor: '#4caf50',
                                '&:hover': { backgroundColor: '#388e3c' }
                              }}
                            >
                              Adopt This Pet
                            </Button>
                          ) : user?.role === 'shelter' && pet.adoptedBy ? (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              fullWidth
                              color="secondary"
                              onClick={() => window.open(`mailto:${typeof pet.adoptedBy === 'object' ? pet.adoptedBy.email : ''}`)}                              
                              disabled={!(typeof pet.adoptedBy === 'object' && pet.adoptedBy.email)}
                            >
                              Contact Adopter
                            </Button>
                          ) : (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              fullWidth
                              disabled
                            >
                              Already Adopted
                            </Button>
                          )}
                        </CardActions>
                      </PetCard>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Show message if no pets in the selected category */}
                {(activeTab === 0 && pets.length === 0) || 
                 (activeTab === 1 && user?.role === 'shelter' && myPets.length === 0) || 
                 (activeTab === (user?.role === 'shelter' ? 2 : 1) && availablePets.length === 0) || 
                 (activeTab === (user?.role === 'shelter' ? 3 : 2) && adoptedPets.length === 0) ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="textSecondary">
                      No pets found in this category.
                    </Typography>
                    {activeTab === 1 && user?.role === 'shelter' && (
                      <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddPetDialog(true)}
                        sx={{ mt: 2, borderRadius: '50px' }}
                      >
                        Add Your First Pet
                      </Button>
                    )}
                  </Box>
                ) : null}
              </Box>
            )}
          </DashboardCard>
        </Container>
      </Box>
      <Footer />
      
      {/* Add Pet Dialog */}
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog 
        open={openAddPetDialog} 
        onClose={() => setOpenAddPetDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{currentPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newPet.name}
            onChange={(e) => setNewPet({...newPet, name: e.target.value})}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Species</InputLabel>
            <Select
              value={newPet.species}
              label="Species"
              onChange={(e) => setNewPet({...newPet, species: e.target.value})}
            >
              <MenuItem value="dog">Dog</MenuItem>
              <MenuItem value="cat">Cat</MenuItem>
              <MenuItem value="bird">Bird</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Breed"
            fullWidth
            value={newPet.breed}
            onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            value={newPet.age}
            onChange={(e) => setNewPet({...newPet, age: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={newPet.description}
            onChange={(e) => setNewPet({...newPet, description: e.target.value})}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Pet Image</Typography>
            {imagePreview ? (
              <Box sx={{ position: 'relative', width: '100%', height: 200, mb: 1 }}>
                <img 
                  src={imagePreview} 
                  alt="Pet preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
                />
                <IconButton 
                  onClick={clearImage}
                  sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.7)' }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 100, 
                  border: '1px dashed #ccc', 
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 1
                }}
              >
                <Typography variant="body2" color="textSecondary">No image selected</Typography>
              </Box>
            )}
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload Image
              <VisuallyHiddenInput 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPetDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPet} color="primary">Add Pet</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DashboardPage;
