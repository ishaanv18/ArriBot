import React, { useEffect, useRef, useState } from 'react';

const AnimatedCounter = ({
    end,
    duration = 2000,
    start = 0,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    triggerOnView = true
}) => {
    const [count, setCount] = useState(start);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        if (!triggerOnView || hasAnimated) {
            animateCounter();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    animateCounter();
                    setHasAnimated(true);
                }
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [end, hasAnimated]);

    const animateCounter = () => {
        const startTime = Date.now();
        const range = end - start;

        const updateCounter = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = start + (range * easeOut);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const formatNumber = (num) => {
        const fixed = num.toFixed(decimals);
        const parts = fixed.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        return parts.join('.');
    };

    return (
        <span ref={elementRef}>
            {prefix}{formatNumber(count)}{suffix}
        </span>
    );
};

export default AnimatedCounter;
