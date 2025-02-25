export const enhanceSvg = (svgString) => {
    if (!svgString) return '';

    // If SVG doesn't have width/height attributes, add them
    if (!svgString.includes('width=') || !svgString.includes('height=')) {
        return svgString.replace('<svg', '<svg width="100%" height="100%"');
    }

    return svgString;
}; 