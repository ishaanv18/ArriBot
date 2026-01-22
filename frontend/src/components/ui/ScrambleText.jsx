import { useState, useEffect } from 'react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";

export const ScrambleText = ({ text, className }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let interval;
        if (isHovering) {
            let iteration = 0;
            interval = setInterval(() => {
                setDisplayText(prev =>
                    text.split("").map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    }).join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        } else {
            setDisplayText(text);
        }
        return () => clearInterval(interval);
    }, [isHovering, text]);

    return (
        <span
            className={`font-mono cursor-default ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {displayText}
        </span>
    );
};
