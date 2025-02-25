'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import IconDisplay from './components/IconDisplay';
import PromptInput from './components/PromptInput';
import Button from './components/Button';
import TipsSection from './components/TipsSection';

export default function Home() {
  const [svg, setSvg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const svgRef = useRef(null);

  const generateIcon = async (prompt, currentSvg = null) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-icon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          currentSvg // Pass the current SVG if we're in edit mode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate icon');
      }

      setSvg(data.svg);
    } catch (err) {
      setError(err.message);
      console.error('Error generating icon:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearIcon = () => {
    setSvg('');
    setError('');
  };

  const copySvgCode = () => {
    if (svg) {
      navigator.clipboard.writeText(svg);

      // Show a temporary success message
      const el = document.createElement('div');
      el.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg';
      el.textContent = 'SVG copied to clipboard!';
      document.body.appendChild(el);

      setTimeout(() => {
        document.body.removeChild(el);
      }, 2000);
    }
  };

  const downloadPng = async () => {
    if (!svg || !svgRef.current) return;

    const svgElement = svgRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    const rect = svgElement.getBoundingClientRect();
    canvas.width = rect.width * 2; // Higher resolution
    canvas.height = rect.height * 2;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.download = 'icon.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Icon Generator</h1>
        <p className="text-gray-600 max-w-md">Create beautiful SVG icons with Claude 3.7 Sonnet AI</p>
      </motion.div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-full md:w-1/2 flex flex-col items-center gap-6">
          <div ref={svgRef}>
            <IconDisplay svg={svg} isLoading={isLoading} />
          </div>

          {svg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Button onClick={copySvgCode} variant="secondary">
                Copy SVG
              </Button>
              <Button onClick={downloadPng} variant="secondary">
                Download PNG
              </Button>
              <Button onClick={clearIcon} variant="danger">
                Clear
              </Button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <PromptInput
            onSubmit={generateIcon}
            isLoading={isLoading}
            currentSvg={svg}
          />

          <TipsSection />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 className="font-medium text-blue-800 mb-2">Example prompts:</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• "A minimalist rocket icon with flame, outlined style"</li>
              <li>• "A colorful gradient chat bubble with a smile inside"</li>
              <li>• "A flat design mountain with sun, blue and orange colors"</li>
              <li>• "A cyberpunk-style lock icon with glowing elements"</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
