import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white hover:shadow-lg hover:shadow-blue-500/30 border border-transparent',
    secondary: 'bg-white text-[#0066FF] hover:bg-gray-50 border border-transparent shadow-md',
    outline: 'bg-transparent border-2 border-white text-white hover:bg-white/10',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-[#0066FF]'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  return <motion.button whileHover={{
    scale: 1.02
  }} whileTap={{
    scale: 0.98
  }} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </motion.button>;
}