# SVG.chat - AI-Powered SVG Icon Generator

SVG.chat is a free and open source design tool allowing you to create custom SVG icons and art using Claude 3.7 Sonnet AI. Simply describe the icon you want, and AI will generate it for you.

![SVG.chat Screenshot](https://github.com/Viktoo/SVG.chat/raw/main/public/svg_chat_demo_screenshot.png)

[Demo video](https://www.linkedin.com/posts/makarskyy_aitools-opensource-claude37-activity-7300056040581083136-sBPw)

## Features

- **AI-Powered Icon Generation**: Create SVG icons by describing them in natural language
- **Edit Mode**: Modify existing icons with additional prompts
- **Export Options**: Copy SVG code or download as PNG
- **Keyboard Shortcuts**: Streamlined workflow with convenient shortcuts
- **Responsive Design**: Works on desktop and mobile devices
- **Client-Side Processing**: Your API key never leaves your browser

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Viktoo/SVG.chat.git
   cd SVG.chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your Anthropic API key in the API key section
2. Type a description of the icon you want to create in the prompt field
3. Click the submit button or press Cmd/Ctrl+Enter
4. Once generated, you can:
   - Copy the SVG code with the "Copy SVG" button
   - Download as PNG with the "Download PNG" button
   - Clear the icon with the "Clear" button
   - Modify the existing icon by entering a new prompt in edit mode

### Example Prompts

- "A simple line art cat icon"
- "An animated sunset"
- "A #FFDE21 face"
- "A #000000 to #FFFFFF gradient circle"
- "A mountain with sun, blue and orange colors"
- "A cyberpunk-style lock icon with glowing elements"

### Keyboard Shortcuts

- **⌘/Ctrl + Enter**: Submit prompt
- **⌘/Ctrl + Backspace**: Clear icon
- **⌘/Ctrl + Shift + C**: Copy SVG code
- **⌘/Ctrl + R**: Clear icon and retry

## How It Works

SVG.chat uses the Anthropic Claude 3.7 Sonnet API to generate SVG icons based on your text descriptions. The application:

1. Takes your text prompt and sends it to the Anthropic API
2. Processes the response to extract clean SVG code
3. Renders the SVG in the browser
4. Provides tools to export or modify the generated icon

Your API key is stored locally in your browser and is only used to authenticate requests to the Anthropic API.

## Technologies Used

- **Next.js**: React framework for the frontend and API routes
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth UI transitions
- **React Hotkeys Hook**: Keyboard shortcut management
- **Anthropic Claude API**: AI model for generating SVG code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Anthropic](https://www.anthropic.com/) for providing the Claude API
- [Next.js](https://nextjs.org/) for the React framework
- All contributors and users of this project

---

Built with ❤️ by [Vik](https://github.com/Viktoo)
