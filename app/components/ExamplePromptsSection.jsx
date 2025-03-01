import { motion } from 'framer-motion';
import { useContext } from 'react';
import Dropdown from './Dropdown';
import { PromptContext } from '../context/PromptContext';

export default function ExamplePromptsSection(isKeyValid) {
    const { promptInputRef } = useContext(PromptContext);

    const examples = [
        "Simple line art cat icon",
        "Animated sunset",
        "Happy face",
        "Calendar icon with the date 18",
        "Mountain with sun and clouds",
        "Trophy award with a star and text 'Best in Show'",
    ];

    const handleExampleClick = (example) => {
        if (!isKeyValid) {
            // Show a notification to enter API key first
            const el = document.createElement('div');
            el.className = 'fixed top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-md shadow-lg';
            el.textContent = 'Please enter your API key first';
            document.body.appendChild(el);

            setTimeout(() => {
                document.body.removeChild(el);
            }, 2000);
            return;
        }

        if (promptInputRef && promptInputRef.current) {
            if (window && window.clearIconBeforeGeneration) {
                window.clearIconBeforeGeneration();
            }
            promptInputRef.current.generateWithoutSettingPrompt(example);
        }
    };

    return (
        <Dropdown
            title="Example Prompts"
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