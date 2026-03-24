
import { motion } from 'framer-motion';

export const GlassPillButton = ({ children, onClick, className }) => {
    return (
        <motion.button
            onClick={onClick}
            className={`relative px-8 py-3 rounded-full bg-glass-surface border border-glass-border backdrop-blur-md text-white font-medium overflow-hidden group ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {/* Glow behind */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-aurora-accent/20 blur-md" />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};
