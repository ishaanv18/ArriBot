import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser && storedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error("Invalid session data:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else {
            // Clean up if state is inconsistent
            if (storedUser === "undefined") {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const verifyOtp = async (email, otp) => {
        const response = await authAPI.verifyOTP(email, otp);
        // If backend returns token on verification, login the user
        // Assuming response.data contains token/user like signin
        // If not, we might need to adjust.
        if (response.data.accessToken || response.data.token) {
            const { accessToken, tokenType, ...userData } = response.data;
            const token = accessToken || response.data.token;
            login(token, userData);
        }
        return response.data;
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        verifyOtp,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
