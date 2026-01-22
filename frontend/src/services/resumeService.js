import axios from 'axios';

const API_URL = 'http://localhost:10000/api/resume';

// Helper to get token
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json' // Default, will override for upload
        }
    };
};

const resumeService = {
    // Upload Resume (PDF)
    uploadResume: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${user?.token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Get All Resumes
    getUserResumes: async () => {
        const response = await axios.get(`${API_URL}/list`, getAuthHeaders());
        return response.data;
    },

    // Get Specific Resume
    getResume: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    // Delete Resume
    deleteResume: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },

    // Trigger AI Analysis
    analyzeResume: async (id, targetRole) => {
        const response = await axios.post(`${API_URL}/${id}/analyze`, null, {
            ...getAuthHeaders(),
            params: { targetRole }
        });
        return response.data;
    },

    // Get Analysis Result
    getAnalysis: async (id) => {
        const response = await axios.get(`${API_URL}/${id}/analysis`, getAuthHeaders());
        return response.data;
    }
};

export default resumeService;
