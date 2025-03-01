import { motion } from 'framer-motion';
import Dropdown from './Dropdown';

export default function TipsSection() {
    const tips = [
        "By default, the icon will be colorful, ask for a 'line art icon' to simplify",
        "Clear between new icon requests",
        "Ask for thinner or thicker lines",
        "Specify hex colors in your prompt",
        "If you get an error, click retry",
        "Try asking for animations or gradients",
        "Keep trying if you don't like the first result",
        "Ask to change theme or style",
        "Ask to remove specific things you don't like",
        "Using keyboard shortcuts is highly recommended",
        "Paste SVG into Figma for fine-tune edits",
    ];

    return (
        <Dropdown title="Usage Tips">
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