import React from 'react';
import { motion } from 'framer-motion';
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}
export function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
  className = ""
}: SectionHeadingProps) {
  return <div className={`mb-12 ${centered ? 'text-center' : 'text-left'} ${className}`}>
      <motion.h2 initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.5
    }} className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </motion.h2>
      {subtitle && <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.5,
      delay: 0.1
    }} className={`flex flex-col ${centered ? 'items-center' : 'items-start'}`}>
          <div className={`h-1 w-20 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-full mb-4 ${!centered && 'self-start'}`} />
        
          <div className={`text-lg max-w-2xl prose ${light ? 'prose-invert text-gray-200' : 'text-gray-600'}`} 
          dangerouslySetInnerHTML={{ __html: subtitle }} />
        </motion.div>}
    </div>;
}