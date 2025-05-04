import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createPet } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

const ImagePreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  backgroundColor: '#f0f0f0',
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  border: '1px dashed #ccc'
}));

const AddPetPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not a shelter/supplier
  React.useEffect(() => {
    if (user && user.role !== 'shelter') {
      navigate('/pets');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData for file upload
      const petFormData = new FormData();
      Object.keys(formData).forEach(key => {
        petFormData.append(key, formData[key]);
      });
      
      if (image) {
        petFormData.append('image', image);
      }
      
      await createPet(petFormData);
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        species: '',
        breed: '',
        age: '',
        description: '',
      });
      setImage(null);
      setImagePreview(null);
      
      // Redirect to pets page after a delay
      setTimeout(() => {
        navigate('/pets');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding pet:', err);
      setError('Failed to add pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: 'calc(100vh - 64px - 200px)' }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => navigate('/pets')}
              sx={{ mr: 2 }}
              aria-label="back to pets"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
              Add a New Pet
            </Typography>
          </Box>
          
          {success && (
            <Alert severity="success" sx={{ mb: 4 }}>
              Pet added successfully! Redirecting to pets page...
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}
          
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ImagePreview>
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Pet preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        <CloudUploadIcon sx={{ fontSize: 60, color: '#aaa', mb: 2 }} />
                        <Typography variant="body1" color="textSecondary">
                          Upload a photo of your pet
                        </Typography>
                      </Box>
                    )}
                  </ImagePreview>
                  
                  <Button
                    component="label"
                    variant="contained"
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
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Pet Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Species</InputLabel>
                    <Select
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      label="Species"
                    >
                      <MenuItem value="dog">Dog</MenuItem>
                      <MenuItem value="cat">Cat</MenuItem>
                      <MenuItem value="bird">Bird</MenuItem>
                      <MenuItem value="rabbit">Rabbit</MenuItem>
                      <MenuItem value="fish">Fish</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age (years)"
                    name="age"
                    type="number"
                    inputProps={{ min: 0, step: 0.1 }}
                    value={formData.age}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      backgroundColor: '#4caf50',
                      '&:hover': {
                        backgroundColor: '#388e3c'
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Add Pet'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AddPetPage;
