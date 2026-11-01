import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
interface FAQItem {
  question: string;
  answer: string;
}
interface FAQProps {
  items: FAQItem[];
  className?: string;
}
export function FAQ({
  items,
  className
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return <div className={`space-y-4 ${className || ''}`}>
      {items.map((item, index) => <div key={index} className="border border-stone-200 rounded-lg overflow-hidden bg-white">
          <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-stone-50 transition-colors">
            <span className="font-semibold text-stone-900 pr-8">
              {item.question}
            </span>
            <span className="text-amber-600 flex-shrink-0">
              {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === index && <motion.div initial={{
          height: 0,
          opacity: 0
        }} animate={{
          height: 'auto',
          opacity: 1
        }} exit={{
          height: 0,
          opacity: 0
        }} transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}>
                <div className="p-5 pt-0 text-stone-600 leading-relaxed border-t border-stone-100">
                  {item.answer}
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>)}
    </div>;
}