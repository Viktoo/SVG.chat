import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColorPalette({ onColorsChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [colors, setColors] = useState([]);
    const [currentColor, setCurrentColor] = useState('#3B82F6'); // Default blue color
    const [hexInput, setHexInput] = useState('#3B82F6');
    const popoutRef = useRef(null);

    // Load colors from localStorage on component mount
    useEffect(() => {
        const savedColors = localStorage.getItem('icon_generator_colors');
        if (savedColors) {
            try {
                const parsedColors = JSON.parse(savedColors);
                setColors(parsedColors);
                // Notify parent component about the loaded colors
                onColorsChange(parsedColors);
            } catch (e) {
                console.error('Error parsing saved colors:', e);
            }
        }
    }, [onColorsChange]);

    // Save colors to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('icon_generator_colors', JSON.stringify(colors));
        // Notify parent component about the color change
        onColorsChange(colors);
    }, [colors, onColorsChange]);

    // Handle clicks outside the popout to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (popoutRef.current && !popoutRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addColor = () => {
        // Validate hex color
        const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(currentColor);

        if (isValidHex && !colors.includes(currentColor)) {
            setColors([...colors, currentColor]);

            setHexInput('');
        }
    };

    const removeColor = (colorToRemove) => {
        setColors(colors.filter(color => color !== colorToRemove));
    };

    const handleHexChange = (e) => {
        const value = e.target.value;
        setHexInput(value);

        // Only update the current color if it's a valid hex
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
            setCurrentColor(value);
        }
    };

    const handleColorPickerChange = (e) => {
        const value = e.target.value;
        setCurrentColor(value);
        setHexInput(value);
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-50"
                aria-label="Color palette"
            >
                {colors.length > 0 ? (
                    <div className="w-5 h-5 rounded-full overflow-hidden relative">
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                            {colors.length === 1 ? (
                                // When there's only one color, render a full circle
                                <circle cx="50" cy="50" r="50" fill={colors[0]} />
                            ) : (
                                // For multiple colors, render pie segments
                                colors.map((color, index) => {
                                    const segmentAngle = 360 / colors.length;
                                    const startAngle = index * segmentAngle;
                                    const endAngle = (index + 1) * segmentAngle;

                                    // Convert angles to radians
                                    const startRad = (startAngle - 90) * Math.PI / 180; // -90 to start from top
                                    const endRad = (endAngle - 90) * Math.PI / 180;

                                    // Calculate points on the circle
                                    const startX = 50 + 50 * Math.cos(startRad);
                                    const startY = 50 + 50 * Math.sin(startRad);
                                    const endX = 50 + 50 * Math.cos(endRad);
                                    const endY = 50 + 50 * Math.sin(endRad);

                                    // Determine if the arc should be drawn the long way around
                                    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

                                    // Create a path for the segment
                                    const path = `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

                                    return (
                                        <path
                                            key={color}
                                            d={path}
                                            fill={color}
                                        />
                                    );
                                })
                            )}
                        </svg>
                    </div>
                ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={popoutRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-52 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10"
                    >
                        <h3 className="font-medium text-gray-800 mb-2">Color Palette</h3>

                        <div className="mb-3">
                            <div className="flex gap-1.5 items-center">
                                <input
                                    type="color"
                                    value={currentColor}
                                    onChange={handleColorPickerChange}
                                    className="w-6 h-8 rounded cursor-pointer overflow-hidden appearance-none flex-shrink-0"
                                    style={{
                                        padding: 0,
                                        border: 'none'
                                    }}
                                />
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="text"
                                        value={hexInput}
                                        onChange={handleHexChange}
                                        placeholder="#RRGGBB"
                                        className="text-gray-700 w-full min-w-0 p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: '#2563EB' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={addColor}
                                        className="h-[34px] flex-shrink-0 bg-blue-600 text-white rounded-md flex items-center justify-center transition-colors px-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs">Add</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200 my-3"></div>

                        {colors.length > 0 && (
                            <div className="grid grid-cols-4 gap-1.5">
                                {colors.map(color => (
                                    <div key={color} className="relative group">
                                        <div
                                            className="w-full aspect-square rounded-md border border-gray-200"
                                            style={{ backgroundColor: color }}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeColor(color)}
                                            className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </motion.button>
                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            {color}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 text-xs text-gray-500">
                            These colors will be suggested to the AI when generating icons.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 