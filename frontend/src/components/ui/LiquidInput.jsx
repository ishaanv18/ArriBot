import { motion } from 'framer-motion';

export const LiquidInput = ({ type, placeholder, value, onChange, icon: Icon }) => (
    <div className="relative group w-full mb-6">
        {Icon && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors z-10" size={20} />
        )}

        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-4 text-white placeholder-white/20 outline-none backdrop-blur-sm transition-all group-hover:bg-white/10 group-focus-within:bg-black/40"
        />

        {/* Animated Liquid Border */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/10">
            <motion.div
                className="h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 w-full origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500"
            />
        </div>

        {/* Glow effect on focus */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/20 to-cyan-400/20 opacity-0 group-focus-within:opacity-100 blur-xl -z-10 transition-opacity duration-500" />
    </div>
);
