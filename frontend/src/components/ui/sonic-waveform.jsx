"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sonic Waveform Canvas Component
export const SonicWaveformCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const draw = () => {
            // Trail effect (fade previous frames) using grey instead of black
            ctx.fillStyle = 'rgba(26, 26, 26, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const lineCount = 60;
            const segmentCount = 80;
            const height = canvas.height / 2;
            
            for (let i = 0; i < lineCount; i++) {
                ctx.beginPath();
                const progress = i / lineCount;
                const colorIntensity = Math.sin(progress * Math.PI);
                
                // Grey/White Monochrome Theme
                ctx.strokeStyle = `rgba(255, 255, 255, ${colorIntensity * 0.35})`;
                ctx.lineWidth = 1.5;

                for (let j = 0; j < segmentCount + 1; j++) {
                    const x = (j / segmentCount) * canvas.width;
                    
                    // Mouse influence
                    const distToMouse = Math.hypot(x - mouse.x, (height) - mouse.y);
                    const mouseEffect = Math.max(0, 1 - distToMouse / 400);

                    // Wave calculation
                    const noise = Math.sin(j * 0.1 + time + i * 0.2) * 20;
                    const spike = Math.cos(j * 0.2 + time + i * 0.1) * Math.sin(j * 0.05 + time) * 50;
                    const y = height + noise + spike * (1 + mouseEffect * 2);
                    
                    if (j === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            time += 0.015;
            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        
        resizeCanvas();
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            {/* The Sonic Canvas (Grey Background) */}
            <canvas ref={canvasRef} className="fixed inset-0 -z-20 w-full h-full bg-[#1a1a1a] pointer-events-none" />
            
            {/* The Grid Overlay (projects the grid on top of the waves) */}
            <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-60
                bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
                bg-[size:40px_40px]" />
        </>
    );
};


// The main hero component wrapper
export const SonicWaveformHero = () => {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2 + 0.5,
                duration: 0.8,
                ease: "easeInOut",
            },
        }),
    };

    return (
        <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Overlay HTML Content */}
            <div className="relative z-20 text-center p-6">
                <motion.div
                    custom={0} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/20 mb-6 backdrop-blur-md mx-auto"
                >
                    <Database className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-gray-200 uppercase tracking-widest">
                        Databricks Genie Space
                    </span>
                </motion.div>

                <motion.h1
                    custom={1} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 font-heading leading-tight"
                >
                    Data is Brutal.<br/>Guesswork is Worse.
                </motion.h1>

                <motion.p
                    custom={2} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 font-medium"
                >
                    Translate complex campus operations into pure data. Hear the patterns, feel the insights, and ask anything in plain English.
                </motion.p>

                <motion.div
                    custom={3} variants={fadeUpVariants} initial="hidden" animate="visible"
                >
                    <Link to="/dashboard" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-gray-200 transition-all duration-300 inline-flex items-center gap-2 mx-auto hover:scale-105">
                        Enter Dashboard
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};
