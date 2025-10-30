# 🌟 Pluto - Interactive Video Learning Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-plutogenz.onrender.com-blue?style=for-the-badge)](https://plutogenz.onrender.com/)
[![GitHub](https://img.shields.io/badge/📂_Source_Code-GitHub-black?style=for-the-badge&logo=github)](https://github.com/mars-alien/pluto/)

*A modern full-stack MERN application designed for interactive video-based learning with AI-powered personalization*

![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwindcss&logoColor=white)

</div>

## 🎯 Overview

Pluto is a next-generation interactive learning platform that combines video content with synchronized coding environments. Built with modern technologies and designed for scalability, it features secure authentication, real-time email notifications, and a responsive UI optimized for educational experiences.

## ✨ Key Features

### 🔐 **Enterprise-Grade Authentication**
- **JWT-based Security**: 7-day token expiration with secure session management
- **OAuth 2.0 Integration**: Seamless Google & GitHub authentication via Passport.js
- **Email Verification**: SendGrid-powered verification with HTML templates & 15-min TTL
- **Password Security**: bcrypt hashing with salt rounds and validation

### 📧 **Advanced Email System**
- **SendGrid Integration**: Professional transactional emails with custom templates
- **Verification Workflows**: 6-digit codes with automatic expiration and retry logic
- **Anti-Spam Protection**: Rate limiting and comprehensive error handling
- **Responsive Templates**: Mobile-friendly HTML email designs

### 🎨 **Modern Frontend Experience**
- **React 19**: Latest React features with Vite for lightning-fast development
- **Tailwind CSS 4**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and micro-interactions
- **Responsive Design**: Mobile-first approach with cross-device compatibility

### 🏗️ **Scalable Architecture**
- **RESTful APIs**: Clean, documented endpoints following industry standards
- **MongoDB Atlas**: Cloud database with optimized indexing and TTL collections
- **Middleware Pipeline**: CORS handling, rate limiting, and error management
- **Modular Structure**: Separation of concerns with MVC architecture

## 🛠️ Technology Stack

### **Backend Infrastructure**
```
Node.js + Express.js     │ Server runtime & web framework
MongoDB + Mongoose       │ Database & ODM with advanced schemas
JWT + Passport.js        │ Authentication & OAuth strategies
SendGrid API            │ Email delivery & template management
bcryptjs                │ Password hashing & security
```

### **Frontend Technologies**
```
React 19 + Vite         │ UI library & build tool
React Router v7         │ Client-side routing & navigation
Tailwind CSS v4         │ Utility-first styling framework
Framer Motion          │ Animation & gesture library
Axios                  │ HTTP client with interceptors
```

### **Development & DevOps**
```
ESLint + Prettier      │ Code quality & formatting
Nodemon               │ Development server with hot reload
CORS                  │ Cross-origin resource sharing
Rate Limiting         │ API protection & throttling
```

## 🚀 Quick Start Guide

### Prerequisites
```bash
Node.js (v18+)    │ JavaScript runtime
MongoDB Atlas     │ Cloud database service
Git              │ Version control
SendGrid Account │ Email service provider
```

### 1️⃣ **Clone & Setup**
```bash
# Clone the repository
git clone https://github.com/mars-alien/pluto.git
cd pluto

# Install root dependencies (if any)
npm install
```

### 2️⃣ **Backend Configuration**
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### 3️⃣ **Frontend Configuration**
```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### 4️⃣ **Access Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000


## ⚙️ Environment Variables

### Backend Configuration (`.env`)
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
CODE_TTL_MINUTES=15

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com

# Server
PORT=5000
```

### Frontend Configuration (`.env`)
```env
# API Configuration
VITE_BACKEND_URL=http://localhost:5000/api
VITE_APP_NAME=Pluto

# OAuth Redirect URLs
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/oauth/callback
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/oauth/callback
```

## 📁 Project Structure

```
pluto/
├── 📂 backend/                 # Node.js + Express API
│   ├── 📂 config/             # Database configuration
│   ├── 📂 controllers/        # Route controllers & business logic
│   ├── 📂 middleware/         # Authentication & validation middleware
│   ├── 📂 models/            # MongoDB schemas (User, VerificationCode)
│   ├── 📂 routes/            # API route definitions
│   ├── 📂 utils/             # Email service & Passport configuration
│   ├── 📄 server.js          # Express application entry point
│   └── 📄 package.json       # Backend dependencies
│
├── 📂 frontend/               # React + Vite application
│   ├── 📂 src/
│   │   ├── 📂 api/           # Axios API client configuration
│   │   ├── 📂 components/    # Reusable UI components
│   │   ├── 📂 context/       # React Context for state management
│   │   ├── 📂 hooks/         # Custom React hooks
│   │   ├── 📂 pages/         # Route components (Login, Register, Dashboard)
│   │   └── 📂 routes/        # Routing configuration
│   ├── 📄 index.html         # HTML entry point
│   ├── 📄 vite.config.js     # Vite build configuration
│   └── 📄 package.json       # Frontend dependencies
│
└── 📄 README.md              # Project documentation
```

## 🔌 API Endpoints

### Authentication Routes
```http
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
POST   /api/auth/send-code     # Send verification code
POST   /api/auth/verify-code   # Verify email code
GET    /api/auth/me           # Get current user
POST   /api/auth/logout       # User logout
GET    /api/auth/google       # Google OAuth
GET    /api/auth/github       # GitHub OAuth
GET    /api/auth/callback     # OAuth callback handler
```

### Utility Routes
```http
GET    /                     # API status
```

## 🎨 UI Components

### Core Components
- **`FormCard`**: Reusable form container with styling
- **`Header`**: Navigation with authentication states
- **`OAuthButtons`**: Social login buttons (Google/GitHub)
- **`PageLayout`**: Consistent page wrapper component

### Pages & Routes
- **`Home`**: Landing page with hero section
- **`Login/Register`**: Authentication forms with validation
- **`Dashboard`**: Protected user dashboard with features overview
- **`OAuthCallback`**: OAuth redirect handler

## 🚀 Deployment

### Backend (Node.js)
```bash
# Production build
npm run build

# Start production server
npm start

# Environment: Set production environment variables
```

### Frontend (React + Vite)
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to hosting service
```

### Recommended Hosting
- **Backend**: Render, Railway, Heroku
- **Frontend**: Vercel, Netlify, Render
- **Database**: MongoDB Atlas
- **Email**: SendGrid

## 🔧 Development Scripts

### Backend Commands
```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm run build      # Build application
```

### Frontend Commands
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint code checking
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive request validation
- **Environment Variables**: Sensitive data protection

## 🔮 Future Roadmap

### Phase 1 - Core Learning Platform
- [ ] Video player with synchronized code editor
- [ ] Real-time code compilation and execution
- [ ] Interactive coding challenges

### Phase 2 - AI Integration
- [ ] Machine learning model for personalized recommendations
- [ ] AI-powered code suggestions and error detection
- [ ] Intelligent progress tracking and analytics

### Phase 3 - Advanced Features
- [ ] Collaborative coding sessions
- [ ] Live instructor sessions
- [ ] Mobile application development

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mars Alien** - *Full Stack Developer*
- GitHub: [@mars-alien](https://github.com/mars-alien)
- LinkedIn: [Connect with me](https://linkedin.com/in/royalsachan)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database solution
- SendGrid for reliable email delivery
- Tailwind CSS for the utility-first styling approach
- All open-source contributors who made this project possible

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

*Built with ❤️ and ☕ by Mars Alien*


</div>



