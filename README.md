# 🌟 Pluto - AI-Powered Interactive Learning Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-plutogenz.onrender.com-blue?style=for-the-badge)](https://plutogenz.onrender.com/)
[![GitHub](https://img.shields.io/badge/📂_Source_Code-GitHub-black?style=for-the-badge&logo=github)](https://github.com/mars-alien/pluto/)

*A comprehensive full-stack MERN application featuring AI-powered code assistance, VS Code-like editor, interactive video learning, and advanced performance analytics*

![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwindcss&logoColor=white)
![AI](https://img.shields.io/badge/AI-Copilot-ff6b6b?logo=openai&logoColor=white)
![Monaco](https://img.shields.io/badge/Monaco-Editor-007ACC?logo=visualstudiocode&logoColor=white)

</div>

## 🎯 Overview

Pluto is a next-generation AI-powered interactive learning platform that combines video content with synchronized coding environments, VS Code-like editor interface, and intelligent code assistance. Built with modern technologies and designed for scalability, it features enterprise-grade authentication, real-time AI chat support, comprehensive learning analytics, and a responsive UI optimized for educational experiences.

## ✨ Key Features

### 🤖 **AI-Powered Code Assistant**
- **Intelligent Copilot**: Real-time code analysis, suggestions, and debugging assistance
- **Natural Language Processing**: ChatGPT-like interface for code explanation and help
- **Smart Action Detection**: Automatic recognition of "explain", "analyze", "fix", and "generate" requests
- **Context-Aware Responses**: Code-specific assistance with proper formatting and syntax highlighting

### 💻 **VS Code-Inspired Editor Interface**
- **Monaco Editor Integration**: Full-featured code editor with syntax highlighting and IntelliSense
- **Multi-Mode Environment**: Seamless switching between coding and interactive drawing modes
- **Collapsible Sidebar**: Files panel, AI Copilot panel, Run & Debug console, and Settings
- **Drawing Canvas**: Interactive drawing tools with 15+ colors, shapes, and text capabilities
- **File Management**: Hierarchical file tree with expand/collapse functionality

### 📊 **Learning Performance Analytics**
- **Comprehensive Dashboard**: Real-time tracking of learning progress and performance metrics
- **Custom Visualizations**: CSS-based charts including bar graphs, pie charts, and activity heatmaps
- **Achievement System**: Gamified learning with badges and milestone tracking
- **Progress Monitoring**: Day streaks, hours learned, exercise completion, and success rates
- **30-Day Activity Patterns**: Detailed learning behavior analysis and insights

### 🎥 **Interactive Video Learning Platform**
- **Synchronized Editor**: Video content paired with live code editing capabilities
- **Bookmark System**: Save and organize important video moments and code snippets
- **Wishlist Functionality**: Curate learning content and track desired courses
- **Watch History**: Comprehensive tracking of learning progress and video consumption
- **Seamless Integration**: Unified experience between video learning and code practice

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
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Component Architecture**: Reusable UI components with consistent design patterns

### 🏗️ **Scalable Architecture**
- **RESTful APIs**: Clean, documented endpoints following industry standards
- **MongoDB Atlas**: Cloud database with optimized indexing and TTL collections
- **Advanced Schemas**: Multiple data models for users, performance, bookmarks, and learning analytics
- **Middleware Pipeline**: CORS handling, rate limiting, and comprehensive error management
- **MVC Structure**: Separation of concerns with modular, maintainable codebase

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
Monaco Editor           │ VS Code-like code editor with IntelliSense
React Router v7         │ Client-side routing & navigation
Tailwind CSS v4         │ Utility-first styling framework
React Context API       │ State management for user sessions
Axios                  │ HTTP client with interceptors
```

### **AI & Analytics**
```
Natural Language Processing │ AI-powered code assistance & chat
Custom CSS Charts          │ Data visualization without external libs
Performance Analytics      │ Learning progress & behavior tracking
Achievement System         │ Gamified learning with badges
```

### **Editor & Drawing Tools**
```
Monaco Editor API      │ Syntax highlighting & code completion
HTML5 Canvas          │ Interactive drawing with multiple tools
File Tree Management  │ Hierarchical project structure
Multi-Mode Interface  │ Code editor + drawing canvas switching
```

### **Development & DevOps**
```
ESLint + Prettier      │ Code quality & formatting
Nodemon               │ Development server with hot reload
CORS                  │ Cross-origin resource sharing
Rate Limiting         │ API protection & throttling
Render Deployment     │ Production hosting with proper CORS
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
│   ├── 📂 models/            # MongoDB schemas (User, LearningPerformance, Wishlist, Bookmark)
│   ├── 📂 routes/            # API route definitions (auth, dashboard, performance, wishlist)
│   ├── 📂 utils/             # Email service & Passport configuration
│   ├── 📄 server.js          # Express application entry point
│   └── 📄 package.json       # Backend dependencies
│
├── 📂 frontend/               # React + Vite application
│   ├── 📂 src/
│   │   ├── 📂 api/           # Axios API client configuration
│   │   ├── 📂 components/    # Reusable UI components
│   │   │   ├── 📂 dashboard/ # Dashboard-specific components
│   │   │   └── 📂 editor/    # Editor components (Sidebar, Canvas, Charts)
│   │   ├── 📂 context/       # React Context for state management
│   │   ├── 📂 hooks/         # Custom React hooks
│   │   ├── 📂 pages/         # Route components
│   │   │   ├── 📄 Dashboard.jsx    # Main dashboard with video player
│   │   │   ├── 📄 Editor.jsx       # VS Code-like editor interface
│   │   │   ├── 📄 Progress.jsx     # Learning analytics dashboard
│   │   │   ├── 📄 Wishlist.jsx     # Course wishlist management
│   │   │   └── 📄 Login/Register   # Authentication pages
│   │   ├── 📂 routes/        # Routing configuration
│   │   └── 📂 services/      # API service functions
│   ├── 📄 index.html         # HTML entry point
│   ├── 📄 vite.config.js     # Vite build configuration
│   └── 📄 package.json       # Frontend dependencies
│
├── 📄 render.yaml            # Render deployment configuration
├── 📄 Dockerfile            # Container configuration
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

### Dashboard Routes
```http
GET    /api/dashboard/stats   # Get dashboard statistics
GET    /api/dashboard/videos  # Get video content
POST   /api/dashboard/activity # Update user activity
```

### Performance Analytics Routes
```http
GET    /api/performance       # Get learning performance data
POST   /api/performance/activity # Update weekly activity
PUT    /api/performance/skills   # Update skill progress
POST   /api/performance/achievements # Add new achievement
PUT    /api/performance/courses     # Update course progress
POST   /api/performance/quiz       # Record quiz performance
POST   /api/performance/projects   # Update project completion
```

### Wishlist & Bookmark Routes
```http
GET    /api/wishlist          # Get user wishlist
POST   /api/wishlist          # Add item to wishlist
DELETE /api/wishlist/:id      # Remove item from wishlist
GET    /api/bookmarks         # Get user bookmarks
POST   /api/bookmarks         # Create new bookmark
DELETE /api/bookmarks/:id     # Delete bookmark
```

### Utility Routes
```http
GET    /                     # API status
GET    /health               # Health check endpoint
```

## 🎨 UI Components

### Core Components
- **`FormCard`**: Reusable form container with styling
- **`Navbar`**: Advanced navigation with authentication states and user menu
- **`OAuthButtons`**: Social login buttons (Google/GitHub)
- **`PageLayout`**: Consistent page wrapper component

### Editor Components
- **`EditorSidebar`**: VS Code-style sidebar with collapsible panels (Files, Copilot, Run, Settings)
- **`DrawingCanvas`**: Interactive drawing interface with tools, colors, and canvas actions
- **`MonacoEditor`**: Code editor integration with syntax highlighting and IntelliSense

### Dashboard Components
- **`VideoPlayer`**: Interactive video player with controls and progress tracking
- **`StatsCards`**: Performance metrics display cards
- **`CourseGrid`**: Course listing with progress indicators
- **`ActivityFeed`**: Recent learning activity timeline

### Analytics Components
- **`WeeklyActivityChart`**: Custom CSS bar chart for weekly learning hours
- **`TimeDistributionChart`**: Pie chart using conic-gradient for time analysis
- **`LearningPatternChart`**: Activity heatmap for 30-day learning patterns
- **`AchievementBadges`**: Gamified achievement display system

### Pages & Routes
- **`Home`**: Landing page with hero section and feature showcase
- **`Login/Register`**: Authentication forms with validation and OAuth integration
- **`Dashboard`**: Main learning hub with video player and course access
- **`Editor`**: VS Code-inspired coding environment with AI assistance
- **`Progress`**: Comprehensive learning analytics and performance dashboard
- **`Wishlist`**: Course wishlist management with filtering and organization
- **`OAuthCallback`**: OAuth redirect handler with token processing

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

## 🔮 Roadmap & Achievements

### ✅ **Completed Features**
- [x] **Video Learning Platform**: Interactive video player with synchronized code editor
- [x] **AI-Powered Assistant**: Intelligent copilot with natural language processing
- [x] **VS Code Editor**: Full-featured editor with Monaco integration and drawing tools
- [x] **Learning Analytics**: Comprehensive performance tracking with custom visualizations
- [x] **Enterprise Authentication**: OAuth 2.0, JWT security, and email verification
- [x] **Production Deployment**: Scalable hosting with proper CORS and static routing

### 🚧 **In Development**
- [ ] Real-time code compilation and execution environment
- [ ] Advanced AI code suggestions with context awareness
- [ ] Interactive coding challenges and assessments
- [ ] Enhanced video synchronization with code checkpoints

### 🔮 **Future Enhancements**
- [ ] **Machine Learning Integration**: Personalized learning path recommendations
- [ ] **Collaborative Features**: Real-time collaborative coding sessions
- [ ] **Live Sessions**: Interactive instructor-led coding workshops
- [ ] **Mobile Application**: Native iOS/Android app with offline capabilities
- [ ] **Advanced Analytics**: Predictive learning outcomes and skill gap analysis
- [ ] **Community Features**: Peer code reviews and discussion forums

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



