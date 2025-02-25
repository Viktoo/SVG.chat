import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TipsSection() {
    const [isOpen, setIsOpen] = useState(false);

    const tips = [
        "For colorful icons, specify colors in your prompt (e.g., 'blue rocket with red flames')",
        "Request specific styles like 'minimalist', 'flat', 'outlined', or '3D'",
        "Specify the viewing angle: 'front view', 'isometric', 'side view'",
        "For complex icons, break down the elements you want to see",
        "Mention if you want text included in the icon",
        "Request specific themes like 'cyberpunk', 'retro', or 'futuristic'",
        "When editing, be specific about what to change (e.g., 'make the background blue')",
        "For edits, you can request to 'keep the same style but change the subject'"
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