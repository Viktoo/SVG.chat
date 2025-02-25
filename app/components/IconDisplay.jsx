import { motion } from 'framer-motion';
import { enhanceSvg } from '../utils/svgUtils';

export default function IconDisplay({ svg, isLoading }) {
    return (
        <motion.div
            className="w-full aspect-square max-w-md bg-white rounded-xl shadow-md flex items-center justify-center p-8 border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            ) : svg ? (
                <div
                    dangerouslySetInnerHTML={{ __html: enhanceSvg(svg) }}
                    className="w-full h-full flex items-center justify-center"
                />
            ) : (
                <div className="text-gray-400 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Your icon will appear here</p>
                </div>
            )}
        </motion.div>
    );
} 