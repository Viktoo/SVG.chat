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

  // useHotkeys('mod+r', (e) => {
  //   e.preventDefault();
  //   console.log('Clear and retry shortcut triggered via react-hotkeys-hook');
  //   clearIcon();

  //   // Resubmit the last prompt if available
  //   if (lastPrompt) {
  //     // Set a small timeout to ensure the UI updates first
  //     setTimeout(() => {
  //       if (promptInputRef.current) {
  //         promptInputRef.current.setPromptAndSubmit(lastPrompt);
  //       }
  //     }, 100);
  //   } else {
  //     // Just focus the input if no last prompt
  //     const promptInput = document.querySelector('textarea');
  //     if (promptInput) {
  //       promptInput.focus();
  //     }
  //   }
  // }, { enableOnFormTags: true });

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

  // Fetch GitHub repository stats
  useEffect(() => {
    const fetchRepoStats = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/Viktoo/SVG.chat');
        if (response.ok) {
          const data = await response.json();
          setRepoStats({
            stars: data.stargazers_count
          });
        }
      } catch (error) {
        console.error('Error fetching repo stats:', error);
      }
    };

    fetchRepoStats();
  }, []);

  return (
    <PromptProvider promptInputRef={promptInputRef}>
      <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-b from-gray-50 to-gray-100">
        {/* GitHub Repository Widget */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl flex justify-center mb-4"
        >
          <a
            href="https://github.com/Viktoo/SVG.chat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="font-medium text-gray-800 text-xs">GitHub</span>
            <div className="flex items-center bg-gray-100 px-2 py-0.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 mr-1">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
              </svg>
              <span className="text-gray-700 text-xs">{repoStats.stars}</span>
            </div>
          </a>
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
