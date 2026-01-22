
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2, Fingerprint, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ScrambleText } from '../components/ui/ScrambleText';

export default function VerifyOTP() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOtp } = useAuth();

    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            toast.error('Session expired. Please restart protocol.');
            navigate('/auth');
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        if (value.length > 1) return;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < 4) newOtp[i] = char;
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 3)].focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 4) {
            toast.error('Incomplete Sequence');
            return;
        }

        setIsLoading(true);
        try {
            await verifyOtp(email, otpCode);
            toast.success('Verified Successfully', { icon: '✅' });
            toast.success('Login Successfully', { icon: '🚀' });
            navigate('/dashboard');
        } catch (error) {
            console.error('Verification failed', error);
            const message = error.response?.data?.message || 'Protocol Mismatch';
            toast.error(message);
            setOtp(['', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-void-base">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
                className="w-full max-w-[420px] z-10 p-1"
            >
                {/* Cyber Header */}
                <div className="flex justify-between items-center text-xs font-mono text-white/20 mb-4 px-2 tracking-widest">
                    <span>SECURE_LINK::ACTIVE</span>
                    <span className="animate-pulse text-cyan-500">AWAITING_KEY</span>
                </div>

                {/* Glass Panel */}
                <div className="bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/10 relative">
                            <div className="absolute inset-0 bg-cyan-400/20 blur-xl animate-pulse-fast" />
                            <ShieldCheck className="text-cyan-400 relative z-10" size={32} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white mb-2">
                            <ScrambleText text="SECURITY PROTOCOL" />
                        </h2>
                        <p className="text-white/40 text-xs font-mono">
                            Enter the 4-digit key sent to <span className="text-white/70">{email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between gap-3 px-4">
                            {otp.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-14 h-16 text-center text-2xl font-mono font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:bg-cyan-900/10 focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all caret-cyan-400"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                />
                            ))}
                        </div>

                        {/* Spam Warning Alert */}
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-3">
                            <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
                            <p className="text-xs text-yellow-200/80 leading-relaxed font-mono">
                                Kindly check spam folder of your mail for the otp its important.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative py-4 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-mono font-bold tracking-widest rounded-xl overflow-hidden group hover:bg-cyan-400 hover:text-black transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLoading ? <Loader2 className="animate-spin" /> : 'AUTHENTICATE'}
                                {!isLoading && <Fingerprint size={20} className="group-hover:scale-110 transition-transform" />}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-white/30 font-mono">
                            Session ID: <span className="text-white/50">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
