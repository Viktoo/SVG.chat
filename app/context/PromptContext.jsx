import { createContext } from 'react';

export const PromptContext = createContext({
    promptInputRef: null,
});

export function PromptProvider({ children, promptInputRef }) {
    return (
        <PromptContext.Provider value={{ promptInputRef }}>
            {children}
        </PromptContext.Provider>
    );
} 