import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const FloatingDock = ({ items }) => {
    let mouseX = useMotionValue(Infinity);

    return (
        <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex h-16 items-end gap-4 rounded-2xl border border-white/10 bg-glass-base backdrop-blur-md px-4 pb-3 z-50"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            {items.map((item) => (
                <DockIcon mouseX={mouseX} key={item.label} {...item} />
            ))}
        </div>
    );
};

const DockIcon = ({ mouseX, icon: Icon, path, label }) => {
    let ref = useRef(null);
    const location = useLocation();
    const isActive = location.pathname === path;

    let distance = useTransform(mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    let widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <Link to={path}>
            <motion.div
                ref={ref}
                style={{ width }}
                className={`aspect-square rounded-full flex items-center justify-center relative group ${isActive ? 'bg-white/10 border-cyan-glow/50' : 'bg-white/5 border-transparent'} border hover:bg-white/20 transition-colors`}
            >
                <Icon className={`w-1/2 h-1/2 ${isActive ? 'text-cyan-400' : 'text-white/60 group-hover:text-white'}`} />

                {/* Tooltip */}
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    {label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                    <motion.div
                        layoutId="activeDock"
                        className="absolute -bottom-2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#00F0FF]"
                    />
                )}
            </motion.div>
        </Link>
    );
};
