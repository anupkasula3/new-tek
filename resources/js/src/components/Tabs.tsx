import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils'; // Assuming a utils file exists, or I'll define a helper locally if needed. I'll use standard class concatenation for safety.
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}
interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
}
export function Tabs({
  items,
  defaultTab,
  className
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0].id);
  return <div className={`w-full ${className || ''}`}>
      <div className="flex flex-wrap border-b border-stone-200 mb-8">
        {items.map(item => <button key={item.id} onClick={() => setActiveTab(item.id)} className={`
              relative px-6 py-4 text-sm font-medium transition-colors duration-200
              ${activeTab === item.id ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}
            `}>
            {item.label}
            {activeTab === item.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" initial={false} transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }} />}
          </button>)}
      </div>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -10
        }} transition={{
          duration: 0.2
        }}>
            {items.find(item => item.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>;
}