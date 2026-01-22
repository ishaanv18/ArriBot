import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../utils/api';
import { Mail, Send, CheckCircle2, AlertCircle, Signal, Radio, Antenna } from 'lucide-react';
import { ScrambleText } from '../components/ui/ScrambleText';
import { TiltCard } from '../components/ui/TiltCard';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.contact(formData.name, formData.email, formData.message);
            if (response.data.success) {
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSuccess(false), 5000);
            }
        } catch (err) {
            setError('Signal Lost. Transmission Failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void-base text-white p-4 md:p-8 flex flex-col items-center">

            {/* Header */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse-fast" />
                        <span className="text-xs font-mono text-orange-400 tracking-widest">SIGNAL_UPLINK // READY</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold"><ScrambleText text="TRANSMIT MESSAGE" /></h1>
                </div>
                <Antenna className="text-white/20" size={32} />
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <TiltCard className="bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                        <h2 className="text-xl font-display font-medium mb-6 flex items-center gap-2">
                            <Radio size={18} className="text-orange-400" />
                            Secure Transmission Protocol
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-wide">Identifier</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-display tracking-wide"
                                    placeholder="Field Marshal K.M. Cariappa"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-wide">Return Frequency (Email)</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-display tracking-wide"
                                    placeholder="commander@base.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-wide">Data Packet</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all font-mono text-sm leading-relaxed resize-none"
                                    placeholder="Enter transmission content..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-orange-500/10 border border-orange-500/30 text-orange-300 font-mono font-bold tracking-widest rounded-xl hover:bg-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                        <span>UPLOADING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Signal size={18} />
                                        <span>INITIATE UPLINK</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-glass-base backdrop-blur-xl flex flex-col items-center justify-center z-20"
                                >
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold font-display">Message Sent</h3>
                                    <p className="text-white/40 text-sm font-mono mt-2">Data uplink successful.</p>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-x-8 bottom-8 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-300"
                                >
                                    <AlertCircle size={18} />
                                    <span className="text-sm font-mono">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </TiltCard>
                </motion.div>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col justify-center space-y-6"
                >
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                                <Mail size={20} />
                            </div>
                            <h3 className="font-display font-medium">Direct Frequency</h3>
                        </div>
                        <p className="text-white/40 font-mono text-sm pl-14">vit1122334@gmail.com</p>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                                <Radio size={20} />
                            </div>
                            <h3 className="font-display font-medium">AI Support Node</h3>
                        </div>
                        <p className="text-white/40 font-mono text-sm pl-14">Automated Neural Response &lt; 2ms</p>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                <Signal size={20} />
                            </div>
                            <h3 className="font-display font-medium">Latency</h3>
                        </div>
                        <p className="text-white/40 font-mono text-sm pl-14">Human Response ~ 24h</p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default ContactUs;
