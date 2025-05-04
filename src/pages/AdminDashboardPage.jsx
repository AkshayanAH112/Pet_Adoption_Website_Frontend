import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Box, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getPets, getUsers, updateUser, deleteUser, updatePet, deletePet } from '../services/api';
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

// Create a component that doesn't pass the 'active' prop to the DOM
const SidebarItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: active ? '#4A90E2' : 'transparent',
  color: active ? 'white' : '#333',
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? '#4A90E2' : '#f0f0f0',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 'bold',
  '&.Mui-selected': {
    color: '#4A90E2'
  }
}));

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState(0);
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [adopters, setAdopters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });
  
  // Pet edit state
  const [openEditPetDialog, setOpenEditPetDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [editPetData, setEditPetData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    mood: ''
  });

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const petsResponse = await getPets();
      setPets(petsResponse.data);
      const usersResponse = await getUsers();
      setUsers(usersResponse.data);
      setSuppliers(usersResponse.data.filter(user => user.role === 'shelter'));
      setAdopters(usersResponse.data.filter(user => user.role === 'adopter'));
      setError(null);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserData({
      name: user.username || '', // Use username from backend model
      email: user.email || '',
      role: user.role || '',
      status: user.status || 'active'
    });
    setOpenEditDialog(true);
  };

  const handleSaveUser = async () => {
    try {
      await updateUser(selectedUser._id, editUserData);
      setOpenEditDialog(false);
      fetchData();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchData();
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  // Pet handlers
  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setEditPetData({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
      description: pet.description || '',
      mood: pet.mood || 'happy'
    });
    setOpenEditPetDialog(true);
  };

  const handleSavePet = async () => {
    try {
      showInfo('Updating pet information...');
      await updatePet(selectedPet._id, editPetData);
      setOpenEditPetDialog(false);
      fetchData();
      showSuccess('Pet updated successfully!');
    } catch (err) {
      console.error('Error updating pet:', err);
      showError('Failed to update pet. Please try again.');
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        showInfo('Deleting pet...');
        await deletePet(petId);
        fetchData();
        showSuccess('Pet deleted successfully!');
      } catch (err) {
        console.error('Error deleting pet:', err);
        showError('Failed to delete pet. Please try again.');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderDashboard = () => (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Dashboard Overview</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
              <PeopleIcon sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Total Users</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{users.length}</Typography>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color="#E8F5E9">
            <Box sx={{ mr: 2, bgcolor: '#4CAF50', p: 1.5, borderRadius: '50%' }}>
              <StorefrontIcon sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Suppliers</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{suppliers.length}</Typography>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color="#E0F7FA">
            <Box sx={{ mr: 2, bgcolor: '#00BCD4', p: 1.5, borderRadius: '50%' }}>
              <PersonIcon sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Adopters</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{adopters.length}</Typography>
            </Box>
          </StatsCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Recent Users</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.slice(0, 5).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name || user.username}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small"
                          label={user.role === 'shelter' ? 'Supplier' : user.role === 'admin' ? 'Admin' : 'Adopter'} 
                          color={user.role === 'admin' ? 'secondary' : user.role === 'shelter' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small"
                          label={user.status || 'Active'} 
                          color={(user.status === 'active' || !user.status) ? 'success' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                size="small" 
                onClick={() => setActiveSection('users')}
                sx={{ textTransform: 'none' }}
              >
                View all users
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Recent Pets</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Species</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pets.slice(0, 5).map((pet) => (
                    <TableRow key={pet._id}>
                      <TableCell>{pet.name}</TableCell>
                      <TableCell>{pet.species}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small"
                          label={pet.isAdopted ? 'Adopted' : 'Available'} 
                          color={pet.isAdopted ? 'secondary' : 'success'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                size="small" 
                onClick={() => setActiveSection('pets')}
                sx={{ textTransform: 'none' }}
              >
                View all pets
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </>
  );

  const renderUsers = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>User Management</Typography>
        <Box>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="user tabs">
            <StyledTab label="All Users" />
            <StyledTab label="Suppliers" />
            <StyledTab label="Adopters" />
          </Tabs>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <DashboardCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                (activeTab === 0 ? users : 
                 activeTab === 1 ? suppliers : 
                 adopters)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: user.role === 'admin' ? '#F2D335' : 
                                    user.role === 'shelter' ? '#4A90E2' : '#4CAF50',
                            mr: 2
                          }}
                        >
                          {user.role === 'admin' ? <DashboardIcon /> : 
                           user.role === 'shelter' ? <StorefrontIcon /> : <PersonIcon />}
                        </Avatar>
                        <Typography>{user.name || user.username}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role === 'shelter' ? 'Supplier' : user.role === 'admin' ? 'Admin' : 'Adopter'} 
                        color={user.role === 'admin' ? 'secondary' : user.role === 'shelter' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status || 'Active'} 
                        color={(user.status === 'active' || !user.status) ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEditUser(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={activeTab === 0 ? users.length : activeTab === 1 ? suppliers.length : adopters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DashboardCard>
    </>
  );

  const renderPets = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Pet Management</Typography>
        <Box>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="pet tabs">
            <StyledTab label="All Pets" />
            <StyledTab label="Available" />
            <StyledTab label="Adopted" />
          </Tabs>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <DashboardCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pet</TableCell>
                <TableCell>Species/Breed</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                (activeTab === 0 ? pets : 
                 activeTab === 1 ? pets.filter(pet => !pet.isAdopted) : 
                 pets.filter(pet => pet.isAdopted))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pet) => (
                  <TableRow key={pet._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={pet.imageUrl} 
                          variant="rounded"
                          sx={{ mr: 2, width: 40, height: 40 }}
                        >
                          <PetsIcon />
                        </Avatar>
                        <Typography>{pet.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {pet.species} {pet.breed ? `/ ${pet.breed}` : ''}
                    </TableCell>
                    <TableCell>
                      {pet.supplier ? (pet.supplier.name || pet.supplier.username || pet.supplier.email || 'Unknown') : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={pet.isAdopted ? 'Adopted' : 'Available'} 
                        color={pet.isAdopted ? 'secondary' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {/* Show edit/delete buttons only if user is admin or if shelter owns the pet */}
                      {(user.role === 'admin' || (user.role === 'shelter' && pet.supplier && pet.supplier._id === user._id)) && (
                        <>
                          <IconButton size="small" color="primary" onClick={() => handleEditPet(pet)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeletePet(pet._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                      {/* Show message if shelter doesn't own the pet */}
                      {user.role === 'shelter' && pet.supplier && pet.supplier._id !== user._id && (
                        <Typography variant="caption" color="text.secondary">
                          Not your pet
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={activeTab === 0 ? pets.length : 
                 activeTab === 1 ? pets.filter(pet => !pet.isAdopted).length : 
                 pets.filter(pet => pet.isAdopted).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DashboardCard>
    </>
  );

  const renderSettings = () => (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>System Settings</Typography>
      <DashboardCard>
        <Typography variant="body1">System settings will be implemented here.</Typography>
      </DashboardCard>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'pets':
        return renderPets();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Access Denied</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You do not have permission to access the admin dashboard.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={() => window.location.href = '/'}
        >
          Go to Homepage
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ backgroundColor: '#f9f9f9', py: 4, minHeight: 'calc(100vh - 64px - 200px)' }}>
        <Container maxWidth="lg">
          {/* Dashboard Header */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#F2D335',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Admin Dashboard
                </Typography>
                <Chip 
                  label="Administrator" 
                  color="secondary"
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

          <Grid container spacing={3}>
            {/* Sidebar */}
            <Grid item xs={12} md={3}>
              <DashboardCard>
                <SidebarItem 
                  active={activeSection === 'dashboard'} 
                  onClick={() => setActiveSection('dashboard')}
                >
                  <DashboardIcon sx={{ mr: 2 }} />
                  <Typography>Dashboard</Typography>
                </SidebarItem>
                <SidebarItem 
                  active={activeSection === 'users'} 
                  onClick={() => setActiveSection('users')}
                >
                  <PeopleIcon sx={{ mr: 2 }} />
                  <Typography>Users</Typography>
                </SidebarItem>
                <SidebarItem 
                  active={activeSection === 'pets'} 
                  onClick={() => setActiveSection('pets')}
                >
                  <PetsIcon sx={{ mr: 2 }} />
                  <Typography>Pets</Typography>
                </SidebarItem>
                <SidebarItem 
                  active={activeSection === 'settings'} 
                  onClick={() => setActiveSection('settings')}
                >
                  <SettingsIcon sx={{ mr: 2 }} />
                  <Typography>Settings</Typography>
                </SidebarItem>
              </DashboardCard>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              <DashboardCard>
                {renderContent()}
              </DashboardCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={editUserData.name}
            onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={editUserData.email}
            onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={editUserData.role}
              label="Role"
              onChange={(e) => setEditUserData({...editUserData, role: e.target.value})}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="shelter">Supplier</MenuItem>
              <MenuItem value="adopter">Adopter</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={editUserData.status}
              label="Status"
              onChange={(e) => setEditUserData({...editUserData, status: e.target.value})}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Pet Edit Dialog */}
      <Dialog open={openEditPetDialog} onClose={() => setOpenEditPetDialog(false)}>
        <DialogTitle>Edit Pet</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={editPetData.name}
            onChange={(e) => setEditPetData({...editPetData, name: e.target.value})}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Species"
            fullWidth
            value={editPetData.species}
            onChange={(e) => setEditPetData({...editPetData, species: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Breed"
            fullWidth
            value={editPetData.breed}
            onChange={(e) => setEditPetData({...editPetData, breed: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            value={editPetData.age}
            onChange={(e) => setEditPetData({...editPetData, age: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editPetData.description}
            onChange={(e) => setEditPetData({...editPetData, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Mood</InputLabel>
            <Select
              value={editPetData.mood}
              label="Mood"
              onChange={(e) => setEditPetData({...editPetData, mood: e.target.value})}
            >
              <MenuItem value="happy">Happy</MenuItem>
              <MenuItem value="sad">Sad</MenuItem>
              <MenuItem value="playful">Playful</MenuItem>
              <MenuItem value="sleepy">Sleepy</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditPetDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePet} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDashboardPage;
