import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({
    particleCount = 50,
    particleColor = '#9333ea',
    particleSize = 3,
    speed = 0.5,
    interactive = true
}) => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const mouse = useRef({ x: null, y: null });
    const animationFrameId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 10;
                this.size = Math.random() * particleSize + 1;
                this.speedY = -Math.random() * speed - 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                // Mouse interaction
                if (interactive && mouse.current.x && mouse.current.y) {
                    const dx = mouse.current.x - this.x;
                    const dy = mouse.current.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 100;

                    if (distance < maxDistance) {
                        const force = (maxDistance - distance) / maxDistance;
                        this.x -= (dx / distance) * force * 2;
                        this.y -= (dy / distance) * force * 2;
                    }
                }

                // Reset particle if it goes off screen
                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                }
            }

            draw() {
                ctx.fillStyle = particleColor;
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // Initialize particles
        particles.current = [];
        for (let i = 0; i < particleCount; i++) {
            particles.current.push(new Particle());
        }

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.current.x = null;
            mouse.current.y = null;
        };

        if (interactive) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseleave', handleMouseLeave);
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections between nearby particles
            particles.current.forEach((particle, i) => {
                particles.current.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = particleColor;
                        ctx.globalAlpha = (1 - distance / 100) * 0.2;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                });
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (interactive) {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseleave', handleMouseLeave);
            }
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [particleCount, particleColor, particleSize, speed, interactive]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none -z-10"
            style={{ opacity: 1 }}
        />
    );
};

export default ParticleBackground;
