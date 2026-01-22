import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for automatic logout on inactivity and tab close
 * @param {number} timeout - Inactivity timeout in milliseconds (default: 5 minutes)
 */
export const useAutoLogout = (timeout = 5 * 60 * 1000) => {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const timerRef = useRef(null);
    const warningShownRef = useRef(false);

    const WARNING_TIME = 60 * 1000; // Show warning 1 minute before logout

    // Activity events to track
    const ACTIVITY_EVENTS = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click'
    ];

    const handleLogout = (reason = 'inactivity') => {
        if (!isAuthenticated) return;

        logout();

        if (reason === 'inactivity') {
            toast.error('Session expired due to inactivity', {
                icon: '⏱️',
                duration: 4000
            });
        }

        navigate('/auth');
    };

    const showWarning = () => {
        if (!warningShownRef.current) {
            toast('Session expiring in 1 minute due to inactivity', {
                icon: '⚠️',
                duration: 5000,
                style: {
                    background: '#fbbf24',
                    color: '#000'
                }
            });
            warningShownRef.current = true;
        }
    };

    const resetTimer = () => {
        // Clear existing timers
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Reset warning flag
        warningShownRef.current = false;

        // Set warning timer (timeout - 1 minute)
        const warningTimer = setTimeout(() => {
            showWarning();
        }, timeout - WARNING_TIME);

        // Set logout timer
        timerRef.current = setTimeout(() => {
            handleLogout('inactivity');
        }, timeout);

        // Store warning timer reference to clear it too
        return () => {
            clearTimeout(warningTimer);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    };

    useEffect(() => {
        // Only apply auto-logout for authenticated users
        if (!isAuthenticated) return;

        // Initialize timer
        const cleanup = resetTimer();

        // Add activity event listeners
        ACTIVITY_EVENTS.forEach(event => {
            window.addEventListener(event, resetTimer, { passive: true });
        });

        // Cleanup
        return () => {
            cleanup();
            ACTIVITY_EVENTS.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [isAuthenticated, timeout]);

    return null;
};
