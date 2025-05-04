import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>

      {/* Main Navigation */}
      <AppBar position="static" sx={{ backgroundColor: 'white', color: '#333', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1, px: 0 }}>
            {/* Logo - Positioned at the very start */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="paw" style={{ fontSize: '2rem', marginRight: '5px' }}>🐾</span>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                  PAW
                  <span style={{ color: '#4A90E2' }}>care</span>
                </Typography>
              </Box>
            </Link>

            {/* Center Navigation Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, ml: 4 }}>
              <Button component={Link} to="/" color="inherit" sx={{ mx: { xs: 0.5, sm: 1 } }}>
                Home
              </Button>
              <Button component={Link} to="/about" color="inherit" sx={{ mx: { xs: 0.5, sm: 1 } }}>
                About Us
              </Button>
              <Button component={Link} to="/pets" color="inherit" sx={{ mx: { xs: 0.5, sm: 1 } }}>
                Pets
              </Button>
              <Button component={Link} to="/matching-quiz" color="inherit" sx={{ mx: { xs: 0.5, sm: 1 } }}>
                Matching Quiz
              </Button>
              <Button component={Link} to="/contact" color="inherit" sx={{ mx: { xs: 0.5, sm: 1 } }}>
                Contact Us
              </Button>
            </Box>
            
            {/* Auth Buttons - Positioned at the very end */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              {isAuthenticated ? (
                <>
                  {user && user.role === 'admin' ? (
                    <Button 
                      component={Link} 
                      to="/admin" 
                      color="inherit" 
                      sx={{ 
                        ml: 1, 
                        bgcolor: '#FFF5DB', 
                        color: '#F2D335', 
                        fontWeight: 'bold', 
                        '&:hover': { bgcolor: '#F2D335', color: '#FFF' } 
                      }}
                    >
                      Admin Dashboard
                    </Button>
                  ) : user && user.role === 'shelter' ? (
                    <Button 
                      component={Link} 
                      to="/dashboard" 
                      color="inherit" 
                      sx={{ ml: 1 }}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <Button 
                      component={Link} 
                      to="/profile" 
                      color="inherit" 
                      sx={{ ml: 1 }}
                    >
                      My Profile
                    </Button>
                  )}
                  <Button 
                    color="inherit" 
                    onClick={logout} 
                    sx={{ 
                      ml: 1, 
                      '&:hover': { bgcolor: '#f5f5f5' } 
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    component={Link} 
                    to="/login" 
                    color="inherit" 
                    sx={{ 
                      ml: 1, 
                      '&:hover': { bgcolor: '#f5f5f5' } 
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/signup" 
                    variant="contained" 
                    color="primary" 
                    sx={{ 
                      ml: 1, 
                      borderRadius: '4px', 
                      '&:hover': { 
                        bgcolor: '#3a7bc8', 
                        transform: 'translateY(-2px)', 
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
