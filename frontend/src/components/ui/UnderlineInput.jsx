
import { motion } from 'framer-motion';

export const UnderlineInput = ({ type, placeholder, value, onChange, icon: Icon }) => {
    return (
        <div className="relative w-full group">
            {Icon && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-aurora-light opacity-50 group-focus-within:opacity-100 group-focus-within:text-aurora-accent transition-all">
                    <Icon size={20} />
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-transparent border-none outline-none py-3 text-white placeholder-white/30 transition-all ${Icon ? 'pl-8' : ''}`}
            />
            {/* Base Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20" />

            {/* Animated Line */}
            <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-aurora-accent group-focus-within:w-full group-focus-within:left-0 transition-all duration-300 ease-out" />
        </div>
    );
};
