
import { motion } from 'framer-motion';

export const LiquidBlob = ({ className }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Core Blob */}
            <motion.div
                className="absolute w-64 h-64 bg-aurora-purple/40 rounded-full blur-3xl mix-blend-screen"
                animate={{
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    rotate: [0, 90, 180, 270, 0],
                    borderRadius: ["40% 60% 70% 30%", "60% 30% 70% 40%", "40% 60% 30% 70%", "60% 40% 70% 30%"],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: "easeInOut"
                }}
            />

            {/* Secondary Blob (Indigo) */}
            <motion.div
                className="absolute w-56 h-56 bg-aurora-indigo/40 rounded-full blur-3xl mix-blend-screen"
                animate={{
                    x: [-30, 30, -20, 40, -30],
                    y: [20, -40, 30, -20, 20],
                    scale: [0.9, 1.1, 1, 0.8, 0.9]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: "easeInOut"
                }}
            />

            {/* Accent Blob (Electric Violet) */}
            <motion.div
                className="absolute w-48 h-48 bg-aurora-accent/30 rounded-full blur-3xl mix-blend-screen"
                animate={{
                    x: [40, -20, 30, -40, 40],
                    y: [-30, 40, -20, 30, -30],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};
