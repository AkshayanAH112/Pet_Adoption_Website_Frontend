# Pet Adoption Website - Frontend

This is the frontend of the Pet Adoption Website, built with React and Material-UI. It allows users to browse, adopt, and manage pets, as well as provides an admin dashboard for managing users and pets.

## Features
- User authentication and registration
- Browse available pets with images
- Adopt pets
- Admin dashboard for managing users, shelters, and pets
- Responsive and modern UI
- File upload for pet images (uploaded to Cloudinary)

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn

### Installation
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```
The app will be available at `http://localhost:5173` (or the port specified in your Vite config).

### Environment Variables
Create a `.env` file in the `frontend` directory and specify the following (example):
```
VITE_API_URL=http://localhost:5000/api
```

### Project Structure
- `src/pages/` - Main pages (Home, Dashboard, Admin, etc.)
- `src/components/` - Reusable UI components
- `src/services/` - API service functions
- `src/context/` - React context providers (e.g., Auth)
- `src/styles/` - CSS files

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
