import { useEffect, useRef } from 'react';

const FireBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();
        window.addEventListener('resize', setSize);

        // Particle configuration
        const particles: Particle[] = [];
        const particleCount = 400; // More particles for a denser core

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            life: number;
            maxLife: number;
            angle: number; // For sinusoidal movement

            constructor() {
                // Concentrate particles in the center
                const spread = canvas!.width * 0.15; // Narrower base
                this.x = canvas!.width / 2 + (Math.random() - 0.5) * spread;
                this.y = canvas!.height; // Start from bottom

                this.size = Math.random() * 25 + 15; // Larger particles
                this.speedX = 0;
                this.speedY = Math.random() * -2 - 1; // Faster upward speed for "drawing" the flame shape, then slowing down
                this.life = Math.random() * 60 + 80;
                this.maxLife = this.life;
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                // Upward movement
                this.y += this.speedY;

                // Sinusoidal "waving" motion
                this.x += Math.sin(this.angle) * 0.5;
                this.angle += 0.1;

                // Shrink and die
                this.life--;
                this.size -= 0.2;

                // Reset if dead
                if (this.life <= 0 || this.size <= 0) {
                    this.reset();
                }
            }

            reset() {
                const spread = canvas!.width * 0.15;
                this.x = canvas!.width / 2 + (Math.random() - 0.5) * spread;
                this.y = canvas!.height + 20; // Start slightly below
                this.size = Math.random() * 25 + 15;
                this.speedY = Math.random() * -2 - 1.5;
                this.life = Math.random() * 60 + 80;
                this.maxLife = this.life;
                this.angle = Math.random() * Math.PI * 2;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const lifeRatio = this.life / this.maxLife;

                let r, g, b, a;

                // Color grading based on life (Heat map)
                // Core (Start): White Hot
                if (lifeRatio > 0.8) {
                    r = 255;
                    g = 255;
                    b = 200; // Slight yellow tint
                    a = 0.8;
                }
                // Mid: Golden/Orange
                else if (lifeRatio > 0.5) {
                    r = 255;
                    g = 160; // Orange
                    b = 0;
                    a = 0.7;
                }
                // End: Deep Red / Smoke
                else {
                    r = 160;
                    g = 20;
                    b = 0;
                    a = 0.5 * lifeRatio; // Fade out
                }

                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            // Dark render clear with very slight trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            // Use black instead of background color to make the fire "pop" against darkness
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Additive blending for the "glow"
            ctx.globalCompositeOperation = 'lighter';

            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setSize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
            style={{
                // Blur the entire canvas slightly to blend particles into a fluid
                filter: 'blur(2px)',
                // Scale up slightly to cover edges if needed
                transform: 'scale(1.1)'
            }}
        />
    );
};

export default FireBackground;
