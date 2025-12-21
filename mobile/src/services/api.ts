import axios from 'axios';
import ENV from '@/config/environment';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/utils/storage';

const api = axios.create({
  baseURL: ENV.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeAuthToken();
      // Could trigger navigation to login here
    }
    return Promise.reject(error);
  }
);

export default api;

// API methods
export const letterApi = {
  getByCode: async (code: string) => {
    const response = await api.get(`/api/letter/${code}`);
    return response.data;
  },
  
  verifyPIN: async (code: string, pin: string) => {
    const response = await api.post(`/api/letter/${code}/verify`, { pin });
    return response.data;
  },
  
  create: async (letterData: any) => {
    const response = await api.post('/api/letter', letterData);
    return response.data;
  },
  
  getMyLetters: async () => {
    const response = await api.get('/api/letter/my-letters');
    return response.data;
  },
};

export const authApi = {
  signIn: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
      await setAuthToken(response.data.token);
    }
    return response.data;
  },
  
  signUp: async (email: string, password: string, name: string) => {
    const response = await api.post('/api/auth/signup', { email, password, name });
    if (response.data.token) {
      await setAuthToken(response.data.token);
    }
    return response.data;
  },
  
  signOut: async () => {
    await removeAuthToken();
    await api.post('/api/auth/logout');
  },
  
  getProfile: async () => {
    const response = await api.get('/api/profile');
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await api.put('/api/profile', data);
    return response.data;
  },
  
  completeOnboarding: async () => {
    const response = await api.post('/api/onboarding');
    return response.data;
  },
};

export const uploadApi = {
  uploadImage: async (uri: string) => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
