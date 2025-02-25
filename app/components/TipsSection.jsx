import { motion } from 'framer-motion';
import Dropdown from './Dropdown';

export default function TipsSection() {
    const tips = [
        "Clear between new icon requests",
        "Specify the color in your prompt",
        "Try adding animations or gradients",
        "If icon is empty, try again",
        "Ask to change theme or style",
        "Ask to remove things you don't like",
        "Try adding 'icon' to prompt to ensure an icon"
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