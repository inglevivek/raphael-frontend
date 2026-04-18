'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react';

const MAX_OVERFLOW = 50;

export interface ElasticSliderProps {
    defaultValue?: number;
    startingValue?: number;
    maxValue?: number;
    className?: string;
    isStepped?: boolean;
    stepSize?: number;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    activeColor?: string;
    onChange?: (value: number) => void;
}

export const ElasticSlider: React.FC<ElasticSliderProps> = ({
    defaultValue = 50,
    startingValue = 0,
    maxValue = 100,
    className = '',
    isStepped = false,
    stepSize = 1,
    leftIcon = null,
    rightIcon = null,
    activeColor = 'bg-primary',
    onChange
}) => {
    return (
        <div className={`flex flex-col items-center justify-center w-full ${className}`}>
            <Slider
                defaultValue={defaultValue}
                startingValue={startingValue}
                maxValue={maxValue}
                isStepped={isStepped}
                stepSize={stepSize}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                activeColor={activeColor}
                onChange={onChange}
            />
        </div>
    );
};

interface SliderProps extends Omit<ElasticSliderProps, 'className'> { }

const Slider: React.FC<SliderProps> = ({
    defaultValue = 50,
    startingValue = 0,
    maxValue = 100,
    isStepped = false,
    stepSize = 1,
    leftIcon,
    rightIcon,
    activeColor,
    onChange
}) => {
    const [value, setValue] = useState<number>(defaultValue);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [region, setRegion] = useState<'left' | 'middle' | 'right'>('middle');
    const clientX = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    useMotionValueEvent(clientX, 'change', (latest: number) => {
        if (sliderRef.current) {
            const { left, right } = sliderRef.current.getBoundingClientRect();
            let newValue: number;
            if (latest < left) {
                setRegion('left');
                newValue = left - latest;
            } else if (latest > right) {
                setRegion('right');
                newValue = latest - right;
            } else {
                setRegion('middle');
                newValue = 0;
            }
            overflow.jump(decay(newValue, MAX_OVERFLOW));
        }
    });

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.buttons > 0 && sliderRef.current) {
            const { left, width } = sliderRef.current.getBoundingClientRect();
            let newValue = startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);
            if (isStepped) {
                newValue = Math.round(newValue / stepSize) * stepSize;
            }
            newValue = Math.min(Math.max(newValue, startingValue), maxValue);
            setValue(newValue);
            if (onChange) onChange(newValue);
            clientX.jump(e.clientX);
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        handlePointerMove(e);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
        animate(overflow, 0, { type: 'spring', bounce: 0.5 });
    };

    const getRangePercentage = (): number => {
        const totalRange = maxValue - startingValue;
        if (totalRange === 0) return 0;
        return ((value - startingValue) / totalRange) * 100;
    };

    return (
        <motion.div
            onHoverStart={() => animate(scale, 1.05)}
            onHoverEnd={() => animate(scale, 1)}
            onTouchStart={() => animate(scale, 1.05)}
            onTouchEnd={() => animate(scale, 1)}
            style={{
                scale,
                opacity: useTransform(scale, [1, 1.05], [0.8, 1])
            }}
            className="flex w-full touch-none select-none items-center justify-center gap-2"
        >
            {leftIcon && (
                <motion.div
                    animate={{ scale: region === 'left' ? [1, 1.4, 1] : 1, transition: { duration: 0.25 } }}
                    style={{ x: useTransform(() => (region === 'left' ? -overflow.get() / scale.get() : 0)) }}
                >
                    {leftIcon}
                </motion.div>
            )}

            <div
                ref={sliderRef}
                className="relative flex w-full flex-grow cursor-grab touch-none select-none items-center py-4"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onLostPointerCapture={handlePointerUp}
            >
                <motion.div
                    style={{
                        scaleX: useTransform(() => {
                            if (sliderRef.current) {
                                const { width } = sliderRef.current.getBoundingClientRect();
                                return 1 + overflow.get() / width;
                            }
                            return 1;
                        }),
                        scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                        transformOrigin: useTransform(() => {
                            if (sliderRef.current) {
                                const { left, width } = sliderRef.current.getBoundingClientRect();
                                return clientX.get() < left + width / 2 ? 'right' : 'left';
                            }
                            return 'center';
                        }),
                        height: useTransform(scale, [1, 1.05], [6, 10]),
                    }}
                    className="flex flex-grow"
                >
                    {/* Track Background */}
                    <div className="relative h-full flex-grow overflow-hidden rounded-full bg-black/40 shadow-inner">
                        {/* Active Fill */}
                        <div className={`absolute h-full rounded-full transition-all duration-100 ${activeColor}`} style={{ width: `${getRangePercentage()}%` }}>
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-white/30"></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {rightIcon && (
                <motion.div
                    animate={{ scale: region === 'right' ? [1, 1.4, 1] : 1, transition: { duration: 0.25 } }}
                    style={{ x: useTransform(() => (region === 'right' ? overflow.get() / scale.get() : 0)) }}
                >
                    {rightIcon}
                </motion.div>
            )}
        </motion.div>
    );
};

function decay(value: number, max: number): number {
    if (max === 0) return 0;
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}