import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import MatchingQuizPage from './pages/MatchingQuizPage';
import PetsPage from './pages/PetsPage';
import PetDetailPage from './pages/PetDetailPage';
import AddPetPage from './pages/AddPetPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';

// Import components
import MoodChangeNotification from './components/MoodChangeNotification';

// Import the new AuthContainer component
import AuthContainer from './components/AuthContainer';

// Import context providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Import API services
import { getPets } from './services/api';

// Tailwind CSS
import './styles/index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2',
    },
    secondary: {
      main: '#FF6B6B',
    },
  },
});

function App() {
  const [sadPets, setSadPets] = useState([]);
  const [showMoodNotification, setShowMoodNotification] = useState(false);

  // Check for sad pets every 5 minutes
  useEffect(() => {
    const checkForSadPets = async () => {
      try {
        const response = await getPets({ mood: 'sad' });
        const sadPetsData = response.data.filter(pet => !pet.isAdopted);
        
        if (sadPetsData.length > 0) {
          setSadPets(sadPetsData);
          setShowMoodNotification(true);
        }
      } catch (error) {
        console.error('Error checking for sad pets:', error);
      }
    };
    
    // Check immediately on app load
    checkForSadPets();
    
    // Then check every 5 minutes
    const interval = setInterval(checkForSadPets, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCloseMoodNotification = () => {
    setShowMoodNotification(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NotificationProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthContainer />} />
              <Route path="/signup" element={<AuthContainer />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/matching-quiz" element={<MatchingQuizPage />} />
              <Route path="/pets" element={<PetsPage />} />
              <Route path="/pets/:id" element={<PetDetailPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/add-pet" element={<AddPetPage />} />
            </Routes>
          </AuthProvider>
          {/* Mood change notification */}
          {showMoodNotification && (
            <MoodChangeNotification 
              sadPets={sadPets} 
              onClose={handleCloseMoodNotification} 
            />
          )}
        </NotificationProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
