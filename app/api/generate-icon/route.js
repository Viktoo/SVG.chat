import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt, currentSvg, apiKey } = await request.json();

        if (!apiKey || !apiKey.startsWith('sk-')) {
            return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        }

        // Construct the appropriate prompt based on whether we're editing or creating
        let userPrompt;

        if (currentSvg) {
            // We're in edit mode
            userPrompt = `I have an existing SVG icon that I want to modify based on this description: "${prompt}".
            
            Here is the current SVG code:
            ${currentSvg}
            
            Please modify this SVG according to my description. 
            
            - Respond ONLY with valid SVG code self-contained with all styling inline
            - If animation explicitly requested, use SMIL animation elements (<animate>, <animateTransform>) instead of CSS animations
            - If gradient explicitly requested, define them with <linearGradient> or <radialGradient> elements
            - Preserve the existing viewBox, width, and height attributes
            - Ensure all IDs are unique and properly referenced
            - No explanations or markdown`;
        } else {
            // We're creating a new icon
            userPrompt = `Create an SVG icon based on this description: "${prompt}".

            - Respond ONLY with valid SVG code self-contained with all styling inline
            - Include width, height, and viewBox attributes
            - If animation explicitly requested, use SMIL animation elements (<animate>, <animateTransform>) instead of CSS animations
            - If gradient explicitly requested, define them with <linearGradient> or <radialGradient> elements
            - Use inline styles with the style attribute or <style> element within the SVG
            - Ensure all IDs are unique and properly referenced
            - Do not include XML declarations or DOCTYPE
            - No explanations or markdown`;
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
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
            return NextResponse.json({ error: errorData.error?.message || 'API request failed' }, { status: response.status });
        }

        const data = await response.json();
        const svgContent = data.content[0].text;

        // Extract just the SVG code if there's any surrounding text
        const svgMatch = svgContent.match(/<svg[\s\S]*?<\/svg>/);
        const cleanSvg = svgMatch ? svgMatch[0] : svgContent;

        return NextResponse.json({ svg: cleanSvg });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 