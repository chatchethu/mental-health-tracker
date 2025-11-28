# 🚀 Quick Start Instructions

## 📋 Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] MongoDB (local or MongoDB Atlas account)
- [ ] Git installed
- [ ] VS Code (recommended) or preferred code editor
- [ ] AssemblyAI API key (optional but recommended)

## ⚡ Quick Setup (5 minutes)

### 1. Clone & Install
```bash
git clone <repository-url>
cd mental-health-tracker

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Setup
```bash
# In backend directory
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

**Minimum required variables:**
```env
MONGODB_URI=mongodb://localhost:27017/mental-health-tracker
JWT_SECRET=your-secret-key-here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 4. Access the Application
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:3001
- 📚 **API Docs**: http://localhost:3001/api/docs

## 🎯 VS Code Setup

### 1. Install Recommended Extensions
Open VS Code and install these extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- MongoDB for VS Code

### 2. Configure Workspace
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🧪 Test the Application

### 1. Test Basic Functionality
1. Open http://localhost:3000
2. Click on mood emotions to track your feeling
3. Set intensity with the slider
4. Add notes and save
5. View your mood in the dashboard

### 2. Test Voice Recording
1. Click the microphone button
2. Allow browser microphone access
3. Record a voice message
4. Click "Analyze Emotion"
5. View AI-powered insights

### 3. Test API Endpoints
Visit http://localhost:3001/api/docs and try:
- POST `/api/auth/register` - Create a test user
- POST `/api/auth/login` - Login
- GET `/api/moods` - Get mood data

## 🔧 Common Issues & Solutions

### ❌ "MongoDB connection failed"
**Solution:**
- Check MongoDB is running locally OR
- Use MongoDB Atlas and update `MONGODB_URI`
- Ensure network access is configured for Atlas

### ❌ "Port already in use"
**Solution:**
```bash
# Kill processes on ports 3000/3001
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:3001 | xargs kill -9
```

### ❌ "Module not found" errors
**Solution:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Microphone permission denied"
**Solution:**
- Use HTTPS or localhost (which is secure)
- Check browser microphone permissions
- Try a different browser (Chrome/Firefox recommended)

## 🎨 Customization Guide

### 1. Change Theme Colors
Edit `frontend/src/app/globals.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Change these values */
  --secondary: 210 40% 96%;
  /* ... */
}
```

### 2. Add New Mood Types
Edit `frontend/src/types/index.ts`:
```typescript
export type EmotionType = 
  | 'happy' 
  | 'sad'
  | 'your-new-mood'  // Add here
  | 'another-mood';
```

### 3. Customize AI Analysis
Edit `backend/src/modules/ai/ai.service.ts` to modify:
- Emotion detection logic
- Suggestion generation
- Risk assessment rules

## 📱 Mobile Testing

### 1. Test on Mobile Device
1. Ensure your phone and computer are on the same WiFi
2. Find your computer's IP address: `ipconfig` (Windows) or `ifconfig` (Mac)
3. Access `http://YOUR_IP:3000` on your phone
4. Test touch interactions and voice recording

### 2. Test PWA Features
1. In Chrome mobile, tap "Add to Home Screen"
2. Launch as an installed app
3. Test offline functionality

## 🚀 Production Deployment

### 1. Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### 2. Backend (Render)
1. Connect repository to Render
2. Set build command: `npm run build`
3. Set start command: `npm run start:prod`
4. Add environment variables

### 3. Database (MongoDB Atlas)
1. Create free cluster
2. Add your backend IP to access list
3. Update connection string

## 🆘 Getting Help

### 📖 Documentation
- Full README: `README.md`
- API Docs: http://localhost:3001/api/docs
- Component Documentation: Code comments

### 🐛 Report Issues
1. Check existing issues first
2. Create detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Error screenshots/logs

### 💬 Community Support
- Discord server: [link]
- GitHub Discussions: [link]

## 🎯 Next Steps

1. **Explore Features**: Try all mood tracking features
2. **Customize UI**: Modify colors and layout
3. **Add AI Services**: Configure AssemblyAI for voice analysis
4. **Deploy**: Get your app online
5. **Share**: Help others improve their mental wellness

---

**Happy coding! 🎉 Remember to take breaks and prioritize your mental health!**