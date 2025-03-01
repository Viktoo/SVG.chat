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
import ApiKeyInput from './components/ApiKeyInput';
import { PromptProvider } from './context/PromptContext';
import { enhanceSvg } from './utils/svgUtils';

export default function Home() {
  const [svg, setSvg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [promptHistory, setPromptHistory] = useState([]);
  const [lastPrompt, setLastPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  const svgRef = useRef(null);
  const promptInputRef = useRef(null);
  const [repoStats, setRepoStats] = useState({ stars: 0 });

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

  useHotkeys('mod+shift+v', (e) => {
    e.preventDefault();
    console.log('Paste last prompt shortcut triggered via react-hotkeys-hook');

    if (lastPrompt && promptInputRef.current) {
      promptInputRef.current.setPrompt(lastPrompt);

      // Focus the textarea after setting the prompt
      const promptInput = document.querySelector('textarea');
      if (promptInput) {
        promptInput.focus();
      }
    }
  }, { enableOnFormTags: true });

  const generateIcon = async (prompt, currentSvg = null) => {
    if (!isKeyValid) {
      setError('Please enter a valid Anthropic API key first');
      return;
    }

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
          currentSvg, // Pass the current SVG if we're in edit mode
          apiKey // Pass the user's API key
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white border border-gray-200 p-4 mb-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="w-2 h-10 bg-amber-500 rounded-full mr-4"></div>
            <p className="text-gray-700 font-medium">
              Site maintenance in progress. Some features may be temporarily limited.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl text-center mb-6"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Icon Generator</h1>
          <p className="text-gray-600 text-lg mx-auto max-w-md">
            Create SVG icons and art with Claude 3.7 Sonnet AI
          </p>
        </motion.div>

        <ApiKeyInput
          apiKey={apiKey}
          setApiKey={setApiKey}
          isKeyValid={isKeyValid}
          setIsKeyValid={setIsKeyValid}
        />

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
                className="flex flex-col items-center gap-3"
              >
                <div className="text-red-500 text-center">
                  {error}
                </div>
                <Button
                  onClick={() => {
                    if (lastPrompt) {
                      generateIcon(lastPrompt);
                    }
                  }}
                  variant="primary"
                  className="w-full"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Retry with same prompt
                  </div>
                </Button>
              </motion.div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <PromptInput
              ref={promptInputRef}
              onSubmit={generateIcon}
              isLoading={isLoading}
              currentSvg={svg}
              isKeyValid={isKeyValid}
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
