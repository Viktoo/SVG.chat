import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

const PromptInput = forwardRef(function PromptInput({ onSubmit, isLoading, currentSvg }, ref) {
    const [prompt, setPrompt] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        setPrompt: (newPrompt) => {
            setPrompt(newPrompt);
        },
        setPromptAndSubmit: (newPrompt) => {
            setPrompt(newPrompt);
            // Use setTimeout to ensure state is updated before submitting
            setTimeout(() => {
                if (newPrompt.trim() && !isLoading) {
                    onSubmit(newPrompt, isEditMode ? currentSvg : null);
                }
            }, 0);
        },
        // New method to generate without setting the prompt text
        generateWithoutSettingPrompt: (promptText) => {
            if (promptText.trim() && !isLoading) {
                onSubmit(promptText, null); // Always pass null for currentSvg to ensure it's a new generation
            }
        }
    }));

    // Set edit mode when we have an existing SVG
    useEffect(() => {
        setIsEditMode(!!currentSvg);
    }, [currentSvg]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSubmit(prompt, isEditMode ? currentSvg : null);
            setPrompt('');
        }
    };

    // Handle keyboard shortcuts for form submission
    const handleKeyDown = (e) => {
        // Check for Ctrl+Enter or Command+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (prompt.trim() && !isLoading) {
                onSubmit(prompt, isEditMode ? currentSvg : null);
                setPrompt('');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="relative w-full">
                <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isEditMode
                        ? "Describe how to modify the current icon..."
                        : "Describe the icon you want to create..."}
                    className="w-full p-4 pr-20 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-all"
                    rows={3}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="absolute bottom-4 right-3 p-2 rounded-md bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </motion.button>
            </div>
            {isEditMode && (
                <div className="mt-2 text-sm text-blue-600 font-medium">
                    Editing mode: Your prompt will modify the existing icon
                </div>
            )}
        </form>
    );
});

export default PromptInput; 