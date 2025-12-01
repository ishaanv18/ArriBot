import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Chat API
export const chatAPI = {
    sendMessage: (message, sessionId) =>
        api.post('/api/chat', { message, sessionId }),

    getChatHistory: (sessionId) =>
        api.get(`/api/chat/history/${sessionId}`),
};

// Flashcards API
export const flashcardsAPI = {
    generate: (topic, count = 5) =>
        api.post('/api/flashcards/generate', { topic, count }),

    getByTopic: (topic) =>
        api.get(`/api/flashcards/topic/${topic}`),

    getAll: () =>
        api.get('/api/flashcards'),
};

// Quiz API
export const quizAPI = {
    generate: (topic, questionCount = 5) =>
        api.post('/api/quiz/generate', { topic, questionCount }),

    getByTopic: (topic) =>
        api.get(`/api/quiz/topic/${topic}`),

    getById: (id) =>
        api.get(`/api/quiz/${id}`),

    getAll: () =>
        api.get('/api/quiz'),
};

// Summary API
export const summaryAPI = {
    summarize: (text) =>
        api.post('/api/summarize', { text }),

    getAll: () =>
        api.get('/api/summarize'),
};

// Auth API
export const authAPI = {
    signup: (fullName, email, password) =>
        api.post('/api/auth/signup', { fullName, email, password }),

    verifyOTP: (email, otp) =>
        api.post('/api/auth/verify-otp', { email, otp }),

    signin: (email, password) =>
        api.post('/api/auth/signin', { email, password }),

    resendOTP: (email) =>
        api.post('/api/auth/resend-otp', { email }),

    contact: (name, email, message) =>
        api.post('/api/auth/contact', { name, email, message }),
};

export default api;
