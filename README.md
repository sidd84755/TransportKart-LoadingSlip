# TransportKart Loading Slip Management System

A modern, full-stack mobile application for managing loading slip receipts in the transportation and logistics industry. Built with React Native (Expo) frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

### Authentication
- Secure login with JWT tokens
- Environment-based credentials
- Session management with AsyncStorage

### Loading Slip Management
- **Create** new loading slip receipts with comprehensive form
- **Save** receipts to database
- **Download** receipts as professional PDF documents
- **View** detailed receipt information
- **List** all saved receipts with search functionality

### Form Fields
- Loading Slip Number
- Loading Date (with date picker)
- Customer Name & Address
- From/To Cities
- Truck Type & Vehicle Number
- Driver Number
- **Vehicle Type** (dropdown: Truck, Trailer, Container, etc.)
- **Material** (text input)
- **Ownership** (dropdown: TransportKART, State Logistics)
- Freight, Detention, Advance amounts
- Auto-calculated Balance
- Remarks

### PDF Generation
- Professional loading slip format matching company standards
- Company branding with SmART-EMS TRANSPORTKART
- Complete receipt details including payment breakdown
- Terms & conditions
- Bank information for payments

### Modern UI/UX
- Material Design 3 with React Native Paper
- Green color scheme matching TransportKart branding
- Responsive design for mobile devices
- Beautiful animations and transitions
- Search and filter functionality

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo SDK 53
- **Expo Router** for file-based navigation
- **React Native Paper** for Material Design components
- **AsyncStorage** for local data persistence
- **Axios** for API communication
- **Date/Time Picker** for date selection
- **Picker Select** for dropdown components

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **html-pdf** for PDF generation
- **CORS** for cross-origin requests
- **dotenv** for environment configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Expo CLI
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TransportKart-LoadingSlip
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/transportkart
AUTH_USERNAME=adminUser
AUTH_PASSWORD=strongPassword123
JWT_SECRET=transportkart_jwt_secret_key_2024
```

### 3. Frontend Setup
```bash
cd ../client
npx expo install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud service
```

### 5. Start the Backend Server
```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

The server will start on `http://localhost:4000`

### 6. Start the Frontend App
```bash
cd client
npx expo start
```

Choose your preferred platform:
- Press `w` for web
- Press `a` for Android (requires Android Studio/emulator)
- Press `i` for iOS (requires Xcode - macOS only)
- Scan QR code with Expo Go app on your mobile device

## 🔐 Default Login Credentials

- **Username:** `adminUser`
- **Password:** `strongPassword123`

## 📱 Usage Guide

### 1. Login
- Open the app and enter the default credentials
- The app will store your session for future use

### 2. Create Loading Slip
- Fill in all required fields (marked with *)
- Use the date picker for loading date
- Select vehicle type and ownership from dropdowns
- Enter freight amount (balance auto-calculates)
- Add optional detention, advance, and remarks

### 3. Save Receipt
- Click "Save" to store the receipt in the database
- Form will reset after successful save

### 4. Download PDF
- Click "Download" to create and download a PDF receipt
- PDF includes all receipt details in professional format

### 5. View Receipt List
- Click "List" or use the menu to view all saved receipts
- Search by loading slip number or customer name
- View or download individual receipts

## 🏗 Project Structure

```
TransportKart-LoadingSlip/
├── client/                 # React Native Expo app
│   ├── app/               # Expo Router pages
│   │   ├── _layout.jsx    # Root layout
│   │   ├── index.jsx      # Entry point
│   │   ├── auth.jsx       # Login screen
│   │   ├── home.jsx       # Main form
│   │   ├── receipt/[id].jsx # Receipt details
│   │   └── receipt-list.jsx # Receipt list
│   ├── src/
│   │   └── utils/
│   │       └── api.js     # API utilities
│   └── App.js             # App entry with theme
├── server/                # Express.js backend
│   ├── models/
│   │   └── Receipt.js     # MongoDB schema
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── receipts.js    # Receipt CRUD routes
│   │   └── download.js    # PDF download route
│   ├── controllers/
│   │   └── receiptController.js # Business logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── utils/
│   │   └── pdfGenerator.js # PDF creation
│   └── server.js          # Express server
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Receipts
- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt
- `GET /api/receipts/:id` - Get receipt by ID
- `PUT /api/receipts/:id` - Update receipt
- `DELETE /api/receipts/:id` - Delete receipt

### Download
- `GET /api/download/:id` - Download receipt as PDF

## 🎨 Customization

### Branding
- Update company details in `server/utils/pdfGenerator.js`
- Modify colors in `client/App.js` theme configuration
- Change logo and icons as needed

### Form Fields
- Add new fields in `server/models/Receipt.js`
- Update form in `client/app/home.jsx`
- Modify PDF template in `server/utils/pdfGenerator.js`

## 🔒 Security Features

- JWT-based authentication
- Environment variable configuration
- Input validation and sanitization
- CORS protection
- Secure password handling

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact:
- Email: connect@transportkart.com
- Phone: +917827568795
- Website: www.transportkart.com

---

**© 2024 TransportKart. All rights reserved.** 