import { motion } from 'framer-motion';
import { useContext } from 'react';
import Dropdown from './Dropdown';
import { PromptContext } from '../context/PromptContext';

export default function ExamplePromptsSection() {
    const { promptInputRef } = useContext(PromptContext);

    const examples = [
        "An animated sunset",
        "A #FFDE21 face",
        "A #000000 to #FFFFFF gradient circle",
        "A mountain with sun, blue and orange colors",
        "A cyberpunk-style lock icon with glowing elements"
    ];

    const handleExampleClick = (example) => {
        if (promptInputRef && promptInputRef.current) {
            if (window && window.clearIconBeforeGeneration) {
                window.clearIconBeforeGeneration();
            }
            promptInputRef.current.generateWithoutSettingPrompt(example);
        }
    };

    return (
        <Dropdown
            title="Example prompts"
            bgColor="bg-gray-100"
            hoverBgColor="bg-gray-200"
            borderColor="border-gray-200"
            textColor="text-gray-800"
        >
            <ul className="p-4 bg-gray-50 rounded-b-lg border-x border-b border-gray-200 space-y-2">
                {examples.map((example, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start group cursor-pointer"
                        onClick={() => handleExampleClick(example)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-blue-500 mr-2 group-hover:text-blue-600">•</span>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">"{example}"</span>
                    </motion.li>
                ))}
            </ul>
        </Dropdown>
    );
} 