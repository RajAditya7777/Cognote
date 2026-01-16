// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && API_URL.includes('localhost')) {
    console.error('⚠️ CRITICAL: Production build is using localhost API URL. Please set NEXT_PUBLIC_API_URL environment variable.');
}

export default API_URL;
