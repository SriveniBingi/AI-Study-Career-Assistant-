import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const summarizeNotes = (text) => API.post('/summarize', { text });
export const generateQuiz = (text) => API.post('/quiz', { text });