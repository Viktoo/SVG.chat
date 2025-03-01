import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

export default function ApiKeyInput({ apiKey, setApiKey, isKeyValid, setIsKeyValid }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isExpanded, setIsExpanded] = useState(!apiKey);
    const [inputValue, setInputValue] = useState(apiKey || '');
    const [showError, setShowError] = useState(false);

    // Check if key exists in localStorage on component mount
    useEffect(() => {
        const savedKey = localStorage.getItem('anthropic_api_key');
        if (savedKey) {
            setApiKey(savedKey);
            setInputValue(savedKey);
            setIsSaved(true);
            setIsKeyValid(true);
            setIsExpanded(false);
        }
    }, [setApiKey, setIsKeyValid]);

    const handleSave = () => {
        if (inputValue.trim().startsWith('sk-')) {
            localStorage.setItem('anthropic_api_key', inputValue);
            setApiKey(inputValue);
            setIsSaved(true);
            setIsKeyValid(true);
            setIsExpanded(false);
            setShowError(false);

            // Show success message temporarily
            const el = document.createElement('div');
            el.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
            el.textContent = 'API key saved successfully!';
            document.body.appendChild(el);

            setTimeout(() => {
                document.body.removeChild(el);
            }, 2000);
        } else {
            setIsKeyValid(false);
            setShowError(true);
        }
    };

    const handleClear = () => {
        localStorage.removeItem('anthropic_api_key');
        setApiKey('');
        setInputValue('');
        setIsSaved(false);
        setIsKeyValid(false);
        setIsExpanded(true);
        setIsVisible(false);
        setShowError(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mb-6"
        >
            <motion.div
                initial={false}
                animate={{
                    height: isExpanded ? 'auto' : '48px',
                    backgroundColor: isSaved ? 'rgb(243, 244, 246)' : 'white'
                }}
                className="w-full rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
                <div
                    className="flex justify-between items-center p-3 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center truncate mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-800 truncate">
                            {isSaved ? 'Anthropic API Key (Saved)' : 'Enter Your Anthropic API Key'}
                        </span>
                    </div>
                    <div className="flex items-center">
                        {isSaved && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mr-3 text-sm text-green-600 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="hidden sm:inline">Ready to use</span>
                            </motion.div>
                        )}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-4"
                        >
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 text-sm text-blue-700">
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>This is an open-source project that needs your own Anthropic API key to run.</li>
                                    <li>Get an API key at <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium">console.anthropic.com</a></li>
                                    <li>Your API key never leaves your browser and is stored only on your device.</li>
                                    <li>View the full source code at <a href="https://github.com/Viktoo/SVG.chat/" target="_blank" rel="noopener noreferrer" className="underline font-medium">github.com/Viktoo/SVG.chat</a></li>
                                </ul>
                            </div>

                            <div className="relative">
                                <input
                                    type={isVisible ? "text" : "password"}
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        if (showError) {
                                            setShowError(false);
                                        }
                                    }}
                                    placeholder="sk-ant-api03-..."
                                    className={`w-full p-3 pr-24 border ${showError ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-gray-900`}
                                />
                                <button
                                    onClick={() => setIsVisible(!isVisible)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-2"
                                    type="button"
                                >
                                    {isVisible ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {showError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-2"
                                >
                                    Please enter a valid Anthropic API key (starts with sk-)
                                </motion.p>
                            )}

                            <div className="flex gap-3 mt-4">
                                <Button onClick={handleSave} variant="primary">
                                    Save API Key
                                </Button>
                                {isSaved && (
                                    <Button onClick={handleClear} variant="danger">
                                        Clear Key
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
} 