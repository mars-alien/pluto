# Google OAuth Setup for Both Localhost and Production

## Required Configuration in Google Cloud Console

### 1. Authorized JavaScript Origins
Add both URLs:
```
http://localhost:5173
https://pluto-g5dj.onrender.com
```

### 2. Authorized Redirect URIs
Add both URLs:
```
http://localhost:5000/api/auth/google/callback
https://pluto-backend-dk2u.onrender.com/api/auth/google/callback
```

### 3. OAuth Consent Screen
- **Authorized domains**: Add `pluto-g5dj.onrender.com`
- **Developer contact information**: Your email

## GitHub OAuth Setup

### 1. OAuth App Settings
- **Authorization callback URL**: 
  - For localhost: `http://localhost:5000/api/auth/github/callback`
  - For production: `https://pluto-backend-dk2u.onrender.com/api/auth/github/callback`

## Environment Variables

### Localhost (.env.localhost)
```bash
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
```

### Production (Render Environment Variables)
```bash
NODE_ENV=production
FRONTEND_URL=https://pluto-g5dj.onrender.com
BACKEND_URL=https://pluto-backend-dk2u.onrender.com
GOOGLE_CALLBACK_URL=https://pluto-backend-dk2u.onrender.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://pluto-backend-dk2u.onrender.com/api/auth/github/callback
```

## Testing

### Localhost
1. Start backend: `npm start` (in backend folder)
2. Start frontend: `npm run dev` (in frontend folder)
3. Visit: `http://localhost:5173`

### Production
1. Deploy to Render
2. Visit: `https://pluto-g5dj.onrender.com`
