# TransportKart Loading Slip Management - Web Client

A modern React web application for managing loading slips and transportation documents.

## Features

- **Authentication**: Secure login with JWT tokens
- **Receipt Management**: View all loading slips in a tabular format
- **Professional PDF Generation**: Download receipts as professional PDFs
- **Responsive Design**: Built with Material-UI for modern, responsive UI
- **Real-time Data**: Connected to the backend API for live data

## Tech Stack

- **Frontend**: React 19 + Vite
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Data Grid**: MUI X Data Grid
- **API Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- Backend server running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Default Credentials

- **Username**: `adminUser`
- **Password**: `strongPassword123`

## Features Overview

### Login Page
- Secure authentication with error handling
- Auto-redirect if already logged in
- Professional TransportKart branding

### Home Page (Receipt List)
- Tabular display of all loading slips
- Sortable and filterable data grid
- Quick actions: View and Download PDF
- Search and export functionality
- Responsive design for all screen sizes

### Receipt View Page
- Professional loading slip format
- Exact replica of the printed document
- Company branding and contact information
- Customer and vehicle details
- Payment information and terms
- Download PDF functionality

## API Integration

The web client connects to the backend API at:
- **Production**: `https://transportkart-loadingslip.onrender.com/api`
- **Local Development**: `http://localhost:4000/api`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/         # Reusable components
├── context/           # React Context providers
├── pages/             # Page components
├── services/          # API services
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Key Components

### Authentication Context (`src/context/AuthContext.jsx`)
- Manages user authentication state
- Handles login/logout functionality
- Provides auth status to components

### API Service (`src/services/api.js`)
- Axios-based API client
- Automatic token injection
- Error handling and 401 redirects

### Data Grid (`src/pages/HomePage.jsx`)
- Advanced table with sorting and filtering
- Custom actions for view and download
- Professional formatting and styling

## Production Build

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contributing

1. Follow the existing code structure
2. Use Material-UI components consistently
3. Maintain responsive design principles
4. Test all functionality before committing

## License

This project is part of the TransportKart Loading Slip Management System.
