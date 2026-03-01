// Use relative path in production (same origin), or env var, or fallback to localhost for dev
export const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'); 