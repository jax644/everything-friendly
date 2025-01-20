console.log('utils.js loaded')

  // Remove line breaks and escape characters from Claude's response so that JSON can be parsed
export function cleanData (inputString) {
    try {
      const cleanedString = inputString
        .replace(/\\n/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
  
      return cleanedString;
    } catch (error) {
      console.error('Error cleaning string:', error);
      return null;
    }
  };

export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';