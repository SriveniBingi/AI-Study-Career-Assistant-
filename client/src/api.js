import axios from 'axios';

// This line is the "brain": 
// It checks if VITE_API_URL exists (Live). If not, it uses localhost (Local).
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
    baseURL: BASE_URL,
});

export default API;