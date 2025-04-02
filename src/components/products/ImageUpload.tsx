import React, { useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  Paper,
  CardMedia
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { showNotification } from '../../utils/notification';
import { getToken } from '../../utils/token-manager';
import { API_BASE_URL } from '../../utils/api-fetch';

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Prepares an image URL with authentication token if needed
 * @param imageUrl The original image URL
 * @returns The image URL with authentication token if needed
 */
const prepareImageUrl = (imageUrl: string): string => {
  // If it's a blob URL (local browser preview), use it directly
  if (imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  
  // If it's already a full URL with http/https, use it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Check if it's from our API and needs token
    if (imageUrl.includes(API_BASE_URL)) {
      const token = getToken();
      // Check if URL already has parameters
      const hasParams = imageUrl.includes('?');
      if (token) {
        return `${imageUrl}${hasParams ? '&' : '?'}auth_token=${token}`;
      }
    }
    return imageUrl;
  }
  
  // It's a relative URL, prepend the API base URL
  const baseUrl = API_BASE_URL;
  const token = getToken();
  
  // Ensure we don't duplicate slashes
  const normalizedUrl = imageUrl.startsWith('/') 
    ? `${baseUrl}${imageUrl}` 
    : `${baseUrl}/${imageUrl}`;
  
  // Add token as query parameter
  return token 
    ? `${normalizedUrl}?auth_token=${token}` 
    : normalizedUrl;
};

interface ImageUploadProps {
  images: string[];
  onUpload: (file: File) => void;
  onRemove: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Process each file
      Array.from(files).forEach(file => {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          showNotification(`File ${file.name} is too large. Maximum size is 5MB.`, 'error');
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showNotification(`File ${file.name} is not an image.`, 'error');
          return;
        }
        
        onUpload(file);
      });
      
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
        multiple // Allow multiple file selection
        id="image-upload-input"
      />
      
      <Button
        variant="outlined"
        startIcon={<AddPhotoAlternateIcon />}
        onClick={handleClick}
        sx={{ mb: 2 }}
      >
        Add Images
      </Button>
      
      <Grid container spacing={2}>
        {images.map((image, index) => {
          const isPreview = image.startsWith('blob:');
          return (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  position: 'relative',
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isPreview ? '2px dashed #4caf50' : 'none' // Green dashed border for previews
                }}
              >
                {isPreview && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      left: 8, 
                      bgcolor: 'rgba(76, 175, 80, 0.8)', 
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    Preview
                  </Typography>
                )}
                <CardMedia
                  component="img"
                  image={prepareImageUrl(image)}
                  alt={`Product image ${index + 1}`}
                  sx={{ 
                    height: '100%', 
                    objectFit: 'contain',
                    p: 1
                  }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemove(index)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          );
        })}
        
        {images.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              No images uploaded yet. Click "Add Images" to upload.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ImageUpload; 