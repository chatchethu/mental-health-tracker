<p align="center">
  <img src="https://raw.githubusercontent.com/chatchethu/mental-health-tracker/main/banner.png" alt="MindfulTrack Banner" />
</p>

# Mental Health Tracker

A comprehensive mental health tracking application with AI-powered voice emotion analysis, mood tracking, and wellness insights.

## 🌟 Features

### Frontend (Next.js 15 + React 19)
- **Modern UI/UX**: Fast, smooth, and emotionally comforting interface
- **Voice Recording**: Real-time voice capture with emotion analysis
- **Mood Tracking**: Quick mood check-ins with intensity levels
- **Data Visualization**: Interactive charts showing mood trends and patterns
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Eye-friendly theme options
- **Daily Quotes**: Inspirational quotes for mental wellness
- **PWA Support**: Install as a mobile app for easy access

### Backend (NestJS + TypeScript)
- **RESTful API**: Well-structured, documented API endpoints
- **Authentication**: Secure JWT-based authentication system
- **Database Integration**: MongoDB with Mongoose ODM
- **AI Integration**: AssemblyAI for voice emotion analysis
- **File Upload**: Secure audio file handling
- **Health Monitoring**: Built-in health check endpoints
- **Swagger Documentation**: Auto-generated API documentation

### AI & Analytics
- **Voice Emotion Detection**: Analyze speech patterns for emotional insights
- **Sentiment Analysis**: Understand the emotional tone of text and voice
- **Risk Assessment**: Identify potential mental health concerns
- **Personalized Suggestions**: AI-driven recommendations based on mood patterns
- **Trend Analysis**: Track emotional patterns over time

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 20+
- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport.js
- **API Documentation**: Swagger/OpenAPI
- **File Upload**: Multer with cloud storage support
- **AI Services**: AssemblyAI, OpenAI (optional)
- **Logging**: Winston

### DevOps & Deployment
- **Frontend Hosting**: Vercel (recommended)
- **Backend Hosting**: Render, Railway, or AWS Lambda
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary or AWS S3
- **Environment**: Docker support

## 📁 Project Structure

```
mental-health-tracker/
├── frontend/                     # Next.js application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # React components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   └── providers/      # Context providers
│   │   ├── lib/                # Utility functions
│   │   ├── store/              # Zustand stores
│   │   ├── hooks/              # Custom React hooks
│   │   └── types/              # TypeScript definitions
│   ├── public/                 # Static assets
│   └── package.json
├── backend/                     # NestJS application
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/           # Authentication
│   │   │   ├── users/          # User management
│   │   │   ├── moods/          # Mood tracking
│   │   │   ├── ai/             # AI services
│   │   │   └── health/         # Health checks
│   │   ├── common/             # Shared utilities
│   │   └── config/             # Configuration
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20+ 
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mental-health-tracker
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Backend Setup
```bash
cd ../backend
npm install
```

### 4. Environment Configuration
Copy the environment template and configure your variables:
```bash
cp .env.example .env
```

Required environment variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/mental-health-tracker

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000

# AI Services (Optional but recommended)
ASSEMBLYAI_API_KEY=your-assemblyai-key
OPENAI_API_KEY=your-openai-key
```

### 5. Database Setup
**Option A: Local MongoDB**
```bash
# Install and start MongoDB locally
mongod
```

**Option B: MongoDB Atlas (Recommended)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI`

### 6. AI Services Setup (Optional)

**AssemblyAI** (for voice analysis):
1. Sign up at [AssemblyAI](https://www.assemblyai.com/)
2. Get your API key
3. Add `ASSEMBLYAI_API_KEY` to your `.env`

**OpenAI** (for advanced text analysis):
1. Sign up at [OpenAI](https://openai.com/)
2. Create an API key
3. Add `OPENAI_API_KEY` to your `.env`

## 🏃‍♂️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Mode
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

## 📱 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health/ping

## 🎯 VS Code Setup

### Recommended Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "mongodb.mongodb-vscode",
    "humao.rest-client"
  ]
}
```

### VS Code Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "html"
  }
}
```

### Debugging Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/main.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/frontend",
      "runtimeArgs": ["--inspect"],
      "port": 9229
    }
  ]
}
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:3001/api/docs for interactive API documentation.

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

**Mood Tracking:**
- `POST /api/moods` - Create mood entry
- `GET /api/moods` - Get user moods
- `GET /api/moods/stats` - Get mood statistics
- `GET /api/moods/trends` - Get mood trends

**AI Analysis:**
- `POST /api/ai/analyze-voice` - Analyze voice recording
- `POST /api/ai/analyze-text` - Analyze text sentiment

## 🔧 Development Workflow

### 1. Feature Development
```bash
# Create a new feature branch
git checkout -b feature/new-feature

# Make changes...

# Run tests and linting
npm run lint
npm test

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 2. Code Quality
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

### 3. Testing
```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Connect repository to Render/Railway
2. Configure environment variables
3. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create cluster in MongoDB Atlas
2. Configure network access
3. Update connection string in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/your-server) for community support

## 🙏 Acknowledgments

- AssemblyAI for voice emotion analysis
- OpenAI for advanced text analysis
- MongoDB for database services
- Vercel for frontend hosting
- The open-source community for the amazing tools and libraries

---

Made with ❤️ for mental wellness and emotional health
