import { motion } from 'framer-motion';
import Dropdown from './Dropdown';

export default function KeyboardShortcutsSection() {
    const shortcuts = [
        { key: "⌘ + Enter", action: "Submit" },
        { key: "⌘ + Backspace", action: "Clear icon" },
        { key: "⌘ + Shift + C", action: "Copy SVG code" },
        // { key: "⌘ + R", action: "Clear icon and retry" }
    ];

    return (
        <Dropdown
            title="Keyboard Shortcuts"
            bgColor="bg-indigo-50"
            hoverBgColor="bg-indigo-100"
            borderColor="border-indigo-200"
            textColor="text-indigo-800"
        >
            <ul className="p-4 bg-white rounded-b-lg border-x border-b border-indigo-200 space-y-3">
                {shortcuts.map((shortcut, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between"
                    >
                        <span className="text-gray-700">{shortcut.action}</span>
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono shadow-sm">
                            {shortcut.key}
                        </kbd>
                    </motion.li>
                ))}
            </ul>
        </Dropdown>
    );
}