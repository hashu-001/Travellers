# Travellers
FYP
# Travellers - Car Rental & Tour Booking Platform

A full-stack web application for car rental and tour booking services with real-time features, payment integration, and multi-user role management.

## 🚀 Features

- **Multi-User Roles**: Customer, Driver, and Admin panels
- **Car Rental System**: Book cars with real-time availability
- **Tour Booking**: Explore and book tour packages
- **Real-time Chat**: Live communication between users
- **Payment Integration**: Secure Stripe payment processing
- **Real-time Status**: Live user activity tracking
- **File Upload**: Profile pictures and car images
- **PDF Generation**: Booking receipts and invoices
- **Email Notifications**: Automated email services
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18.2.0) - UI framework
- **Material-UI** (v7.1.1) - Component library
- **React Router** (v7.6.2) - Navigation
- **Socket.io Client** (v4.8.1) - Real-time communication
- **Axios** (v1.10.0) - HTTP client
- **Chart.js** (v4.4.9) - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v4.18.2) - Web framework
- **MongoDB** (v7.5.0) - Database
- **Mongoose** (v7.5.0) - ODM
- **Socket.io** (v4.8.1) - Real-time server
- **JWT** (v9.0.2) - Authentication
- **Multer** (v1.4.5) - File uploads
- **Nodemailer** (v6.9.4) - Email service
- **PDFKit** (v0.14.0) - PDF generation
- **Stripe** (v18.3.0) - Payment processing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Travellers
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

Create environment files for both backend and frontend:

#### Backend (.env file in backend directory)
```bash
cd backend
```

Create a `.env` file with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travellers_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

#### Frontend (.env file in frontend directory)
```bash
cd frontend
```

Create a `.env` file with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `travellers_db`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in backend `.env`

### 5. Stripe Setup (for payments)

1. Create account at [Stripe](https://stripe.com)
2. Get your API keys from Stripe Dashboard
3. Update `STRIPE_SECRET_KEY` in backend `.env`
4. Update `REACT_APP_STRIPE_PUBLISHABLE_KEY` in frontend `.env`

### 6. Email Setup (optional)

For email notifications:
1. Use Gmail or any SMTP provider
2. Update email configuration in backend `.env`
3. For Gmail, use App Password instead of regular password

## 🚀 Running the Application

### Development Mode

#### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:5000`

#### 2. Start Frontend Application
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

### Production Mode

#### 1. Build Frontend
```bash
cd frontend
npm run build
```

#### 2. Start Production Server
```bash
cd backend
npm start
```

## 📁 Project Structure

```
Travellers/
├── backend/                 # Backend server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── Components/     # React components
│   │   ├── Pages/          # Page components
│   │   ├── Panels/         # User role panels
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## 👥 User Roles

### Customer
- Browse and book cars
- Book tour packages
- View booking history
- Chat with drivers
- Make payments
- Update profile

### Driver
- View assigned bookings
- Update booking status
- Chat with customers
- View earnings
- Upload car documents

### Admin
- Manage all users
- View all bookings
- Monitor payments
- Manage cars and tours
- View analytics
- Handle refunds

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Trips
- `POST /api/trips` - Create trip booking
- `GET /api/trips` - Get user trips
- `PUT /api/trips/:id` - Update trip

### Payments
- `POST /api/payments/create-session` - Create payment session
- `POST /api/payments/webhook` - Stripe webhook
- `POST /api/payments/refund` - Process refund

### Chat
- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/messages` - Send message

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- File upload restrictions
- Secure payment processing

## 📱 Real-time Features

- Live user status tracking
- Real-time chat messaging
- Instant booking notifications
- Live payment status updates

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**
   - Change port in `.env` file
   - Kill existing processes on the port

3. **Stripe Payment Issues**
   - Verify Stripe keys are correct
   - Check webhook configuration
   - Ensure test mode is enabled for development

4. **File Upload Errors**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure proper file types

### Development Commands

```bash
# Check MongoDB connection
cd backend
node -e "console.log(require('mongoose').connection.readyState)"

# Test API endpoints
cd backend
node test-api.js

# Clean up demo data
cd backend
node cleanup-demo-users.js
```

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review the existing documentation
- Create an issue in the repository

---

**Note**: This is a development setup. For production deployment, additional security measures, environment configurations, and deployment procedures should be implemented. 
