import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt, currentSvg } = await request.json();

        // Construct the appropriate prompt based on whether we're editing or creating
        let userPrompt;

        if (currentSvg) {
            // We're in edit mode
            userPrompt = `I have an existing SVG icon that I want to modify based on this description: "${prompt}".
            
            Here is the current SVG code:
            ${currentSvg}
            
            Please modify this SVG according to my description. 
            
            Important requirements:
            - Respond ONLY with valid SVG code
            - No explanations or markdown
            - The SVG should be simple, clean, and suitable as an icon
            - Maintain the same viewBox if possible
            - Include appropriate colors
            - The SVG should be self-contained with all styling inline`;
        } else {
            // We're creating a new icon
            userPrompt = `Create an SVG icon based on this description: "${prompt}". 
            
            Important requirements:
            - Respond ONLY with valid SVG code
            - No explanations or markdown
            - The SVG should be simple, clean, and suitable as an icon
            - Use a viewBox that makes sense for the icon
            - Only change colors if explicity requested
            - The SVG should be self-contained with all styling inline`;
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData }, { status: response.status });
        }

        const data = await response.json();
        const svgContent = data.content[0].text;

        // Extract just the SVG code if there's any surrounding text
        const svgMatch = svgContent.match(/<svg[\s\S]*<\/svg>/);
        const cleanSvg = svgMatch ? svgMatch[0] : svgContent;

        return NextResponse.json({ svg: cleanSvg });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 