import axios from 'axios';

// 1. We define the dynamic base. 
// If VITE_API_URL is set (on Vercel), it uses that.
// If not (on your Laptop), it uses localhost.
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

// 2. Now your API object is ready for both!
const API = axios.create({ 
    baseURL: BASE_URL 
});

export const summarizeNotes = async (formData) => {
    // This uses your custom API instance we just set up
    const response = await API.post('/api/summarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const generateRoadmap = async (data) => {
    const response = await API.post('/api/roadmap', data);
    return response.data;
};

export const loginUser = (data) => API.post('/api/auth/login', data);
export const signupUser = (data) => API.post('/api/auth/signup', data);

export default API;