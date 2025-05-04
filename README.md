# Pet Adoption Website - Frontend

## Project Overview

The Pet Adoption Website is a full-stack application designed to connect pet shelters with potential adopters. This repository contains the frontend portion of the application, built with React.js and Material UI. The platform offers a modern, responsive interface with interactive elements and animations to create an engaging user experience.

## Key Features

### User Management
- **Authentication System**: Secure login and registration with JWT
- **Role-Based Access**: Different interfaces for regular users, shelters, and administrators
- **User Profiles**: Personal information and adoption history tracking

### Pet Management
- **Pet Gallery**: Browse all available pets with filtering options
- **Pet Details**: Comprehensive information about each pet
- **Pet Creation**: Shelters can add new pets with image uploads
- **Pet Updates**: Edit pet information and status

### Adoption Process
- **Adoption Flow**: Simple process to adopt available pets
- **Adoption Certificate**: Customizable, printable certificate upon successful adoption
- **Celebration Animations**: Confetti effects when adoption is completed

### Mood System
- **Dynamic Pet Moods**: Pets' moods change based on time in the system
- **Mood Notifications**: Alerts when pets become sad and need attention
- **Visual Indicators**: Color-coded mood representation

### Admin Features
- **User Management**: View and manage all users in the system
- **Statistics Dashboard**: Track adoption rates and system metrics
- **Content Moderation**: Review and manage pet listings

### UI/UX Features
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Material UI Components**: Modern, accessible interface elements
- **Animations**: Smooth transitions and interactive effects using Framer Motion
- **Notifications**: Toast notifications for user actions

## Technical Stack

- **Framework**: React.js (v18) with functional components and hooks
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Material UI v5 for consistent styling and components
- **State Management**: React Context API for global state
- **Routing**: React Router v6 for navigation
- **HTTP Client**: Axios for API communication
- **Form Handling**: Controlled components with state
- **Animations**: Framer Motion for transitions and effects
- **Styling**: CSS-in-JS with Material UI's styled components

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn
- Backend server running (see backend repository)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AkshayanAH112/Pet_Adoption_Website_Frontend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Pet_Adoption_Website_Frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Setup
Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:5001/api
```

Adjust the URL to match your backend server configuration.

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` by default.

### Building for Production
```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
/frontend
├── public/             # Static assets
│   └── images/         # Image assets including certificate
├── src/
│   ├── assets/         # Local assets
│   ├── components/     # Reusable UI components
│   │   ├── AdoptionCertificate.jsx
│   │   ├── MoodChangeNotification.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── context/        # React context providers
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── PetsPage.jsx
│   │   ├── PetDetailPage.jsx
│   │   ├── AddPetPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   └── ...
│   ├── services/       # API service layer
│   │   └── api.js
│   ├── styles/         # Global styles
│   │   ├── index.css
│   │   └── print.css
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
```

## Key Implementation Details

### Authentication Flow
The application uses JWT-based authentication with tokens stored in localStorage. The `AuthContext` provides user information and authentication methods throughout the application.

```jsx
// Example usage of AuthContext
const { user, login, logout } = useAuth();
```

### File Upload
Pet images are uploaded using FormData and sent to the backend where they're processed by Cloudinary:

```jsx
// Example of image upload
const petFormData = new FormData();
petFormData.append('name', petName);
petFormData.append('image', selectedFile);
await createPet(petFormData);
```

### Adoption Certificate
When a pet is adopted, a customizable certificate is generated that can be printed:

```jsx
// Printing the certificate
const printCertificate = () => {
  window.print();
  showSuccess('Certificate ready for printing!');
};
```

### Notifications
The application includes a notification system for user feedback:

```jsx
// Example of notification usage
const { showSuccess, showError } = useNotification();
showSuccess('Pet adopted successfully!');
```

### Image Upload
Pet images are uploaded via file input using FormData and sent to the backend, which then uploads them to Cloudinary.

### Build for Production
```bash
npm run build
# or
yarn build
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## License
MIT
