import { motion } from 'framer-motion';
import Dropdown from './Dropdown';

export default function TipsSection() {
    const tips = [
        "To change color, specify the color in your prompt (e.g., 'use #53A2EB')",
        "For complex icons, break down the elements you want to see",
        "Request specific themes like 'simple', 'rounded', or 'cute'",
        "Clear between each new icon request",
    ];

    return (
        <Dropdown title="Tips for better icons">
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
        </Dropdown>
    );
} 