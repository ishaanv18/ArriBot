
import { motion } from 'framer-motion';

export const FlipContainer = ({ isFlipped, front, back, className }) => {
    return (
        <div className={`relative w-full h-full perspective-1000 ${className}`}>
            <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden w-full h-full">
                    {front}
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 backface-hidden w-full h-full"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    {back}
                </div>
            </motion.div>
        </div>
    );
};
