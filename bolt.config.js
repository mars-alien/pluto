export default {
  // Bolt.new configuration for Pluto MERN app
  name: 'pluto-learning-platform',
  
  // Build configuration
  build: {
    // Frontend build
    frontend: {
      command: 'cd frontend && npm run build',
      outputDir: 'frontend/dist'
    },
    
    // Backend build (if needed)
    backend: {
      command: 'cd backend && npm install',
      outputDir: 'backend'
    }
  },
  
  // Development configuration
  dev: {
    command: 'npm run dev',
    port: 5173
  },
  
  // Production configuration
  start: {
    command: 'npm start',
    port: 5000
  },
  
  // Environment variables
  env: {
    NODE_ENV: 'production',
    PORT: '5000'
  },
  
  // Static files
  static: {
    dir: 'frontend/dist',
    fallback: 'index.html' // For SPA routing
  }
};
