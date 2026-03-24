
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const GlassCard = ({ children, className, hoverEffect = true, ...props }) => {
    return (
        <motion.div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl p-6 shadow-2xl transition-all duration-500",
                hoverEffect && "group hover:border-aurora-accent/40 hover:bg-glass-highlight",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            {...props}
        >
            {/* Iridescent Border Gradient on Hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aurora-accent/10 to-transparent" style={{ transform: 'skewX(-20deg) translateX(-100%)', animation: 'shine 3s infinite' }} />
            </div>
            {children}
        </motion.div>
    );
};
