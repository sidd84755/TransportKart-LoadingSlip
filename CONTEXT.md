Project Context and Architecture

1. Overview

This mobile application provides a simple authenticated form workflow. Users log in with predefined credentials, fill out a form, and can save, download (PDF receipt), or view a list of saved receipts. The app is built using React Native (Expo) on the frontend, Node.js/Express on the backend, and MongoDB for data persistence.

2. Tech Stack

Frontend: React Native with Expo (Use file based routing) and do not use .tsx please use .jsx for the native code

Backend: Node.js, Express.js

Database: MongoDB (via Mongoose)

PDF Generation: html-pdf or pdfkit (backend)

Authentication: Simple env-based usernames/passwords

3. Environment Configuration

Create a .env file in the backend root:

PORT=4000
MONGODB_URI=mongodb://localhost:27017/myapp
AUTH_USERNAME=adminUser
AUTH_PASSWORD=strongPassword123
JWT_SECRET=your_jwt_secret

Note: Keep .env out of version control. Use dotenv in Express to load variables.

4. Folder Structure

client/             # Expo React Native
├── App.js
├── src/
│   ├── screens/
│   │   ├── AuthScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── ReceiptView.jsx
│   │   └── ReceiptList.jsx
│   ├── components/
│   │   └── FormFields.jsx
│   └── navigation/
│       └── AppNavigator.jsx
└── package.json

server/                # Express API
├── server.js
├── routes/
│   ├── auth.js
│   ├── receipts.js
│   └── download.js
├── controllers/
│   └── receiptController.js
├── models/
│   └── Receipt.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   └── pdfGenerator.js
└── package.json

5. Authentication Flow

Login Screen (AuthScreen.js)

Two text inputs: username, password

On submit, call POST /api/auth/login with credentials.

On success, store JWT token (AsyncStorage) and navigate to Home.

Backend (routes/auth.js)

Validate against AUTH_USERNAME and AUTH_PASSWORD from process.env.

If valid, issue a JWT signed with JWT_SECRET.

6. Main Form & Buttons (Home)

HomeScreen.js renders a form (e.g. invoice, order details) and three buttons:

Save

Action: POST /api/receipts with form payload and Authorization header.

Backend: save to MongoDB, return new receipt ID.

Download

Action: navigate to ReceiptView with receipt ID.

List

Action: navigate to ReceiptList.

7. Download & PDF Generation

ReceiptView.js

Fetch GET /api/receipts/:id → display receipt details in styled components.

Button: Download PDF → call GET /api/download/:id.

Backend

Route download.js uses pdfGenerator.js to render HTML receipt and convert to PDF.

Send PDF as response with Content-Disposition: attachment.

8. Receipt List

ReceiptList.js

Fetch GET /api/receipts → display in a FlatList table.

Each row: receipt date, total, and view/download buttons.

Backend (routes/receipts.js)

GET /api/receipts → return array of receipts (ID, summary).