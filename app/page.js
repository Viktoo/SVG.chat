'use client';

import { useState, useRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion } from 'framer-motion';
import IconDisplay from './components/IconDisplay';
import PromptInput from './components/PromptInput';
import Button from './components/Button';
import TipsSection from './components/TipsSection';
import ExamplePromptsSection from './components/ExamplePromptsSection';
import KeyboardShortcutsSection from './components/KeyboardShortcutsSection';
import { PromptProvider } from './context/PromptContext';
import { enhanceSvg } from './utils/svgUtils';

export default function Home() {
  const [svg, setSvg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [promptHistory, setPromptHistory] = useState([]);
  const [lastPrompt, setLastPrompt] = useState('');
  const svgRef = useRef(null);
  const promptInputRef = useRef(null);

  useHotkeys('mod+backspace', (e) => {
    e.preventDefault();
    console.log('Clear shortcut triggered via react-hotkeys-hook');
    clearIcon();
  }, { enableOnFormTags: true });

  useHotkeys('mod+shift+c', (e) => {
    if (svg) {
      e.preventDefault();
      console.log('Copy SVG shortcut triggered via react-hotkeys-hook');
      copySvgCode();
    }
  }, { enableOnFormTags: true });

  useHotkeys('mod+r', (e) => {
    e.preventDefault();
    console.log('Clear and retry shortcut triggered via react-hotkeys-hook');
    clearIcon();

    // Resubmit the last prompt if available
    if (lastPrompt) {
      // Set a small timeout to ensure the UI updates first
      setTimeout(() => {
        if (promptInputRef.current) {
          promptInputRef.current.setPromptAndSubmit(lastPrompt);
        }
      }, 100);
    } else {
      // Just focus the input if no last prompt
      const promptInput = document.querySelector('textarea');
      if (promptInput) {
        promptInput.focus();
      }
    }
  }, { enableOnFormTags: true });

  const generateIcon = async (prompt, currentSvg = null) => {
    setIsLoading(true);
    setError('');

    // Save the prompt to history and as the last prompt
    setLastPrompt(prompt);
    setPromptHistory(prev => [...prev, prompt]);

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
      // Use the enhanced SVG for copying
      navigator.clipboard.writeText(enhanceSvg(svg));

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

  useEffect(() => {
    window.clearIconBeforeGeneration = clearIcon;

    return () => {
      delete window.clearIconBeforeGeneration;
    };
  }, []);

  return (
    <PromptProvider promptInputRef={promptInputRef}>
      <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Icon Generator</h1>
          <p className="text-gray-600 text-lg mx-auto max-w-md">
            Create SVG icons and art with Claude 3.7 Sonnet AI
          </p>
        </motion.div>

        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="w-full md:w-1/2 flex flex-col items-center gap-4">
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

          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <PromptInput
              ref={promptInputRef}
              onSubmit={generateIcon}
              isLoading={isLoading}
              currentSvg={svg}
            />

            <KeyboardShortcutsSection />
            <TipsSection />
            <ExamplePromptsSection />
          </div>
        </div>
      </div>
    </PromptProvider>
  );
}
