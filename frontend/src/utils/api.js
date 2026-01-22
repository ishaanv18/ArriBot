import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get current user ID safely
const getUserId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== "undefined") {
            const user = JSON.parse(userStr);
            return user.id || user._id; // Handle both id formats
        }
    } catch (e) {
        console.error("Error reading user from storage", e);
    }
    return null;
};

// Request interceptor to add userId if not provided (optional, but good practice)
// For now, we will updating specific methods to be explicit

// Response interceptor for global error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 429) {
            const data = error.response.data;
            // You can emit a custom event or use a toast library here if imported
            // For now, we'll attach a custom property to the error for components to check
            error.isRateLimit = true;
            error.rateLimitMessage = data.message || "Too many requests";
            console.warn("AI Rate Limit Exceeded:", error.rateLimitMessage);
        }
        return Promise.reject(error);
    }
);

// Chat API
export const chatAPI = {
    sendMessage: (message, sessionId, userId) =>
        api.post('/api/chat', {
            message,
            sessionId,
            userId: userId || getUserId()
        }),

    getChatHistory: (sessionId) =>
        api.get(`/api/chat/history/${sessionId}`),
};

// Flashcards API
export const flashcardsAPI = {
    generate: (topic, count = 5, userId) =>
        api.post('/api/flashcards/generate', {
            topic,
            count,
            userId: userId || getUserId()
        }),

    getByTopic: (topic) =>
        api.get(`/api/flashcards/topic/${topic}`),

    getAll: () =>
        api.get('/api/flashcards'),
};

// Quiz API
export const quizAPI = {
    generate: (topic, questionCount = 5, userId) =>
        api.post('/api/quiz/generate', {
            topic,
            questionCount,
            userId: userId || getUserId()
        }),

    getByTopic: (topic) =>
        api.get(`/api/quiz/topic/${topic}`),

    getById: (id) =>
        api.get(`/api/quiz/${id}`),

    getAll: () =>
        api.get('/api/quiz'),
};

// Summary API
export const summaryAPI = {
    summarize: (text, userId) =>
        api.post('/api/summarize', {
            text,
            userId: userId || getUserId()
        }),

    getAll: () =>
        api.get('/api/summarize'),
};

// AI Usage API
export const aiUsageAPI = {
    getStats: (userId) =>
        api.get(`/api/ai/usage/stats?userId=${userId || getUserId()}`),
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
