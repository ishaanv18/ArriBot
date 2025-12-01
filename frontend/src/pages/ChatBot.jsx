import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAPI } from '../utils/api';

const AVATARS = ['👨‍💻', '👩‍💻', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🤖', '👽', '🦊', '🐱', '🐶', '🦄'];

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => `session-${Date.now()}`);
    const [userAvatar, setUserAvatar] = useState('👨‍💻');
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const messagesEndRef = useRef(null);

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

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: userMessage, avatar: userAvatar }]);
        setIsLoading(true);

        try {
            const response = await chatAPI.sendMessage(userMessage, sessionId);
            setMessages(prev => [...prev, { role: 'ai', content: response.data.aiResponse, avatar: '🤖' }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: 'Sorry, I encountered an error. Please try again.',
                avatar: '🤖'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    AI ChatBot
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                    Ask me anything about coding, learning, or general questions!
                </p>

                {/* Avatar Selector */}
                <div className="relative inline-block">
                    <button
                        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                        className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100"
                    >
                        <span className="text-gray-600">Your Avatar:</span>
                        <span className="text-2xl">{userAvatar}</span>
                        <span className="text-xs text-purple-500">▼</span>
                    </button>

                    <AnimatePresence>
                        {showAvatarSelector && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-purple-100 p-4 z-20 grid grid-cols-4 gap-2"
                            >
                                {AVATARS.map((avatar) => (
                                    <button
                                        key={avatar}
                                        onClick={() => {
                                            setUserAvatar(avatar);
                                            setShowAvatarSelector(false);
                                        }}
                                        className={`text-2xl p-2 rounded-lg hover:bg-purple-50 transition-colors ${userAvatar === avatar ? 'bg-purple-100 ring-2 ring-purple-400' : ''}`}
                                    >
                                        {avatar}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <div className="glass rounded-2xl shadow-2xl overflow-hidden relative z-10">
                {/* Chat Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                    <AnimatePresence>
                        {messages.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-gray-400 mt-20"
                            >
                                <div className="text-6xl mb-4 animate-bounce">💬</div>
                                <p className="text-lg">Start a conversation by typing a message below</p>
                            </motion.div>
                        )}

                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-end space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'ai' && (
                                    <div className="avatar avatar-ai flex-shrink-0">
                                        {message.avatar || '🤖'}
                                    </div>
                                )}

                                <div className={`${message.role === 'user' ? 'message-user order-1' : 'message-ai'}`}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>

                                {message.role === 'user' && (
                                    <div className="avatar avatar-user flex-shrink-0 ml-3">
                                        {message.avatar || userAvatar}
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start items-end space-x-3"
                            >
                                <div className="avatar avatar-ai flex-shrink-0">🤖</div>
                                <div className="message-ai">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="border-t border-purple-200 p-4 bg-white/50 backdrop-blur-sm">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="input-field flex-1 bg-white/80"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputMessage.trim()}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <span className="hidden sm:inline">Send</span>
                            <span className="text-xl">📤</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
