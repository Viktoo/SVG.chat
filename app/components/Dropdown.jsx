import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dropdown({ title, children, bgColor = 'bg-gray-100', hoverBgColor = 'bg-gray-200', borderColor = 'border-gray-200', textColor = 'text-gray-800' }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full max-w-md">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 ${bgColor} rounded-lg flex justify-between items-center hover:${hoverBgColor} transition-colors border ${borderColor}`}
            >
                <span className={`font-medium ${textColor}`}>{title}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${textColor} ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 