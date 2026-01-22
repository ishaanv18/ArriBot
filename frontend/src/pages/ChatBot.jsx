import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAPI } from '../utils/api';
import { MessageSquare, Send, Cpu, User, RefreshCw, Zap } from 'lucide-react';
import { ScrambleText } from '../components/ui/ScrambleText';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => `session-${Date.now()}`);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await chatAPI.sendMessage(userMessage, sessionId);
            setMessages(prev => [...prev, { role: 'ai', content: response.data.aiResponse }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: 'Error: Neural Link Disrupted. Please retry transmission.'
            }]);
        } finally {
            setIsLoading(false);
            // Re-focus input after sending
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <div className="min-h-screen bg-void-base text-white p-4 md:p-8 pb-40 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-fast" />
                        <span className="text-xs font-mono text-cyan-400 tracking-widest">NEURAL_LINK // V.2.1</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold"><ScrambleText text="AI COMPAGNION" /></h1>
                </div>
                <Cpu className="text-white/20" size={32} />
            </div>

            {/* Chat Interface */}
            <div className="w-full max-w-4xl flex-1 flex flex-col bg-glass-base backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden relative h-[70vh]">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <AnimatePresence>
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-white/30">
                                <Zap size={48} className="mb-4 opacity-50" />
                                <p className="font-mono text-sm">INITIALIZE CONVERSATION SEQUENCE...</p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${message.role === 'user' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-violet-500/10 border-violet-500/30 text-violet-400'}`}>
                                    {message.role === 'user' ? <User size={14} /> : <Cpu size={14} />}
                                </div>

                                <div className={`max-w-[80%] p-4 rounded-2xl border backdrop-blur-md ${message.role === 'user'
                                    ? 'bg-cyan-950/30 border-cyan-500/20 text-cyan-100 rounded-tr-none'
                                    : 'bg-glass-base border-white/10 text-white/90 rounded-tl-none'
                                    }`}>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{message.content}</p>
                                    <div className="mt-2 text-[10px] font-mono opacity-40 uppercase">
                                        {message.role === 'user' ? 'Transmission_Sent' : 'Process_ID: ' + Math.random().toString(16).substr(2, 6)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border bg-violet-500/10 border-violet-500/30 text-violet-400">
                                    <Cpu size={14} />
                                </div>
                                <div className="flex gap-1 items-center h-10 px-4">
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black/20 border-t border-white/10">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Input command or query..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-mono text-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputMessage.trim()}
                            className="absolute right-2 p-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
