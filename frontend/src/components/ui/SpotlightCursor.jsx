
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const SpotlightCursor = () => {
    // 1. Spotlight (Spring/Laggy)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for the spotlight lag
    const springConfig = { damping: 25, stiffness: 700 };
    const spotlightX = useSpring(mouseX, springConfig);
    const spotlightY = useSpring(mouseY, springConfig);

    // 2. Pointer Dot (Instant/Direct)
    const dotX = useMotionValue(0);
    const dotY = useMotionValue(0);

    useEffect(() => {
        const moveCursor = (e) => {
            // Spotlight centers 300px div
            mouseX.set(e.clientX - 150);
            mouseY.set(e.clientY - 150);

            // Dot centers 8px div (approx)
            dotX.set(e.clientX - 4);
            dotY.set(e.clientY - 4);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <>
            {/* The Laggy Spotlight */}
            <motion.div
                className="fixed top-0 left-0 w-[300px] h-[300px] pointer-events-none z-[9998] mix-blend-screen"
                style={{
                    x: spotlightX,
                    y: spotlightY,
                    background: `radial-gradient(circle, rgba(112, 0, 255, 0.15) 0%, rgba(0, 240, 255, 0.05) 40%, transparent 70%)`
                }}
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(black,transparent_70%)]" />
            </motion.div>

            {/* The Instant Pointer Dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] pointer-events-none z-[9999]"
                style={{
                    x: dotX,
                    y: dotY
                }}
            />
        </>
    );
};
