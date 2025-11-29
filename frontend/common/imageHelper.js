/**
 * Image URL helper function
 * Handles both API uploaded images and local static images
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads, it's from the API
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }
  
  // Otherwise, it's a local static asset
  return imagePath;
};

export default getImageUrl;

