import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:10000') + '/api/learning-path';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

const learningPathService = {
    // Generate a new AI-powered learning path
    generate: async (goal, weeks = 4) => {
        const response = await axios.post(
            `${API_URL}/generate`,
            { goal, weeks },
            getAuthHeaders()
        );
        return response.data;
    },

    // Get all learning paths for the current user
    getAll: async () => {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },

    // Get a specific learning path by ID
    getById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    // Mark a daily milestone as completed or uncompleted
    updateMilestone: async (id, week, day, completed) => {
        const response = await axios.patch(
            `${API_URL}/${id}/milestone`,
            { week, day, completed },
            getAuthHeaders()
        );
        return response.data;
    },

    // Delete a learning path
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    }
};

export default learningPathService;
