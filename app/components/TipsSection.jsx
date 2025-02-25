import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TipsSection() {
    const [isOpen, setIsOpen] = useState(false);

    const tips = [
        "To change color, specify the color in your prompt (e.g., 'use #53A2EB')",
        "For complex icons, break down the elements you want to see",
        "Request specific themes like 'simple', 'rounded', or 'cute'",
        "Clear between each new icon request (Command+Backspace or Ctrl+Backspace)",
        "Add max details in first icon request for best results",
        "Clear and try again if you don't like the results"
    ];

    return (
        <div className="w-full max-w-md">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 bg-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-200 transition-colors"
            >
                <span className="font-medium">Tips for better icons</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
                        <ul className="p-4 bg-gray-50 rounded-b-lg border-x border-b border-gray-200 space-y-2">
                            {tips.map((tip, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start"
                                >
                                    <span className="text-blue-500 mr-2">•</span>
                                    <span>{tip}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 