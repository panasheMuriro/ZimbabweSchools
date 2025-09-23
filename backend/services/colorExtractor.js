// import Vibrant from 'node-vibrant';
import { Vibrant } from "node-vibrant/node";

export async function getPaletteFromImageUrl(imageUrl) {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();
    
    // Create a robust color scheme, with fallbacks
    const colors = {
      primary: palette.Vibrant?.hex || palette.Muted?.hex || '#0D47A1', // A safe blue
      secondary: palette.DarkVibrant?.hex || palette.DarkMuted?.hex || '#F5F5F5', // A light gray
      accent: palette.LightVibrant?.hex || palette.Vibrant?.hex || '#FFC107' // A vibrant yellow/amber
    };
      
    console.log(`Extracted Palette: primary: ${colors.primary}, secondary: ${colors.secondary}, accent: ${colors.accent}`);
    // Return a formatted string ready for the prompt
    return `primary: ${colors.primary}, secondary: ${colors.secondary}, accent: ${colors.accent}`;

  } catch (error) {
    console.error('Error extracting color palette:', error);
    // Return a high-quality default palette on failure
    return 'primary: #1E3A8A, secondary: #E5E7EB, accent: #F59E0B';
  }
}