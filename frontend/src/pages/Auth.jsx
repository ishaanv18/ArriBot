
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { LiquidInput } from '../components/ui/LiquidInput';
import { ScrambleText } from '../components/ui/ScrambleText';
import { GlassPillButton } from '../components/ui/GlassPillButton';
import { Mail, Lock, User, Key, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    // Unified Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Client-Side Validation
        if (!formData.email || !formData.password) {
            toast.error("Credentials Required", { icon: '🚫' });
            return;
        }

        if (isSignUp && (!formData.fullName || !formData.confirmPassword)) {
            toast.error("Incomplete Protocol", { icon: '🚫' });
            return;
        }

        setIsLoading(true);

        try {
            if (isSignUp) {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Code Mismatch");
                }

                // Real API Call
                await authAPI.signup(formData.fullName, formData.email, formData.password);

                toast.success("Identity Created. Proceed", { icon: '🆔' });
                navigate('/verify-otp', { state: { email: formData.email } });
            } else {
                // Real API Call
                const response = await authAPI.signin(formData.email, formData.password);

                // Update Context with Token & User from response
                // Response structure assumed to be { token: "...", type: "...", id: ..., username: "...", email: "...", roles: [...] } based on standard JWT responses
                // Or standardized { status: "success", data: { token, user } }

                // Let's inspect typical response from backend (Spring Boot usually returns direct object)
                // We'll trust the response contains 'token' and user details.
                const { accessToken, tokenType, ...userData } = response.data;
                const token = accessToken || response.data.token; // Fallback

                if (!token) throw new Error("Security Token Missing");

                login(token, userData);

                toast.success("Access Granted", { icon: '🔓' });
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Access Denied";

            // Handle Unverified User Case
            if (msg.includes("Please verify your email first") || msg.toLowerCase().includes("verify")) {
                toast.error("Account not verified. Sending OTP...", { icon: '⚠️' });
                try {
                    await authAPI.resendOTP(formData.email);
                    toast.success("OTP Sent. Please check your email.", { icon: '📩' });
                    navigate('/verify-otp', { state: { email: formData.email } });
                } catch (resendError) {
                    console.error("Resend failed", resendError);
                    toast.error("Failed to send OTP. Please try refreshing.", { icon: '❌' });
                    // Still navigate so they can try resend button there
                    navigate('/verify-otp', { state: { email: formData.email } });
                }
                setIsLoading(false);
                return;
            }

            toast.error(msg, { icon: '🛑' });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-void-base pb-32">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-glow/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Floating Vault Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
                className="w-full max-w-[420px] z-10 p-1"
            >
                {/* Cyber Decor */}
                <div className="flex justify-between items-center text-xs font-mono text-white/20 mb-4 px-2 tracking-widest">
                    <span>SECURE_CHANNEL_802.11x</span>
                    <span>{isSignUp ? 'REGISTER_PROTOCOL' : 'LOGIN_PROTOCOL'}</span>
                </div>

                {/* Glass Panel */}
                <div className="bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/10 transform rotate-45 group hover:rotate-90 transition-transform duration-700">
                            <Key className="transform -rotate-45 text-cyan-400 group-hover:-rotate-90 transition-transform duration-700" size={28} />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">
                            <ScrambleText text={isSignUp ? "NEW_IDENTITY" : "BIOMETRIC_SCAN"} />
                        </h2>
                        <p className="text-white/40 text-sm">Enter credentials to bypass firewall.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <AnimatePresence mode="popLayout">
                            {isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <LiquidInput
                                        type="text"
                                        placeholder="Designation (Name)"
                                        value={formData.fullName}
                                        onChange={(e) => handleChange({ target: { name: 'fullName', value: e.target.value } })}
                                        icon={User}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <LiquidInput
                            type="email"
                            placeholder="Wormhole Address (Email)"
                            value={formData.email}
                            onChange={(e) => handleChange({ target: { name: 'email', value: e.target.value } })}
                            icon={Mail}
                        />

                        <LiquidInput
                            type="password"
                            placeholder="Access Key (Password)"
                            value={formData.password}
                            onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } })}
                            icon={Lock}
                        />

                        <AnimatePresence mode="popLayout">
                            {isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <LiquidInput
                                        type="password"
                                        placeholder="Confirm Key"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange({ target: { name: 'confirmPassword', value: e.target.value } })}
                                        icon={Lock}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-6">
                            <button
                                disabled={isLoading}
                                className="w-full relative py-4 bg-white/5 border border-white/10 text-white font-mono font-bold tracking-widest rounded-xl overflow-hidden group hover:bg-white/10 transition-colors"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'INTIIALIZE_USER' : 'ACCESS_MAINFRAME')}
                                    {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                </span>
                                {/* Shatter Effect Overlay (Visual Only for now) */}
                                <div className="absolute inset-0 bg-cyan-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </div>
                    </form>

                    {/* Footer Switcher */}
                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs font-mono text-white/30 hover:text-cyan-400 transition-colors uppercase tracking-widest border-b border-transparent hover:border-cyan-400"
                        >
                            {isSignUp ? "Already identified? Log In" : "New User? Create Protocol"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
