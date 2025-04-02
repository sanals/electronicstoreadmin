import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Divider,
  Stack,
  FormControlLabel,
  Switch,
  Paper,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ProductFormData } from '../../types/product.types';
import { Category } from '../../types/category.types';
import ImageUpload from './ImageUpload';
import SpecificationsEditor from './SpecificationsEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ProductCreateRequest, 
  ProductUpdateRequest, 
  ProductResponse,
  CategorySummary
} from '../../types/api-responses';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { useApiRequest } from '../../hooks/useApiRequest';
import { showNotification } from '../../utils/notification';

interface ProductFormProps {
  initialData?: ProductFormData;
  categories: Category[];
  onSubmit: (data: ProductFormData, images: File[]) => Promise<void>;
  isLoading: boolean;
}

const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .positive('Price must be a positive number')
    .required('Price is required'),
  categoryId: yup.number().required('Category is required'),
  stock: yup
    .number()
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required')
});

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [specifications, setSpecifications] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBy, setCreatedBy] = useState<string>('');
  const [lastModifiedBy, setLastModifiedBy] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductCreateRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: 0,
      stock: 0
    }
  });
  
  const { 
    data: categories, 
    loading: loadingCategories, 
    execute: fetchCategories 
  } = useApiRequest<CategorySummary[], []>(CategoryService.getAllCategories);
  
  const {
    loading: loadingProduct,
    execute: fetchProduct
  } = useApiRequest<ProductResponse, [number]>(ProductService.getProductById);
  
  useEffect(() => {
    fetchCategories();
    
    if (isEditMode && id) {
      fetchProduct(parseInt(id)).then(response => {
        if (response?.status === 'SUCCESS' && response.data) {
          const product = response.data;
          reset({
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.category.id,
            stock: product.stock
          });
          
          try {
            setSpecifications(JSON.parse(product.specifications || '{}'));
          } catch (error) {
            console.error('Failed to parse specifications:', error);
            setSpecifications({});
          }
          
          setImages(product.images || []);
          setCreatedBy(product.createdBy || '');
          setLastModifiedBy(product.lastModifiedBy || '');
          setCreatedAt(product.createdAt || '');
          setUpdatedAt(product.updatedAt || '');
        }
      });
    }
  }, [isEditMode, id, fetchCategories, fetchProduct, reset]);
  
  const handleImageUpload = (file: File) => {
    console.log('Adding image file to upload list:', file.name);
    
    // Add to image files array for later submission
    setImageFiles(prevFiles => [...prevFiles, file]);
    
    // Create a temporary URL for preview
    const previewUrl = URL.createObjectURL(file);
    setImages(prevImages => [...prevImages, previewUrl]);
    
    showNotification('Image added and will be uploaded when you save the product', 'success');
  };
  
  const handleRemoveImage = (index: number) => {
    // Remove from both the preview images and the files to upload
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // Only remove from image files if it's a new image (not from the server)
    if (index < imageFiles.length) {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const onSubmit = async (data: ProductCreateRequest) => {
    setIsSubmitting(true);
    showNotification('Saving product...', 'info');
    
    try {
      const productData: ProductCreateRequest = {
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        specifications: JSON.stringify(specifications),
        stock: Number(data.stock)
      };
      
      // Filter out blob URLs from the images array when sending to the backend
      const apiImages = images.filter(img => !img.startsWith('blob:'));
      
      let response;
      
      if (isEditMode && id) {
        // Update existing product with images
        const updateData: ProductUpdateRequest = {
          ...productData,
          images: apiImages
        };
        
        response = await ProductService.updateProductWithImages(
          parseInt(id),
          updateData,
          imageFiles
        );
      } else {
        // Create new product with images
        response = await ProductService.createProductWithImages(
          productData,
          imageFiles
        );
      }
      
      if (response?.status === 'SUCCESS') {
        // Clean up blob URLs after successful submission
        images.forEach(image => {
          if (image.startsWith('blob:')) {
            URL.revokeObjectURL(image);
          }
        });
        
        showNotification(
          isEditMode ? 'Product updated successfully' : 'Product created successfully',
          'success'
        );
        navigate('/products');
      } else {
        showNotification(
          `Failed to ${isEditMode ? 'update' : 'create'} product: ${response?.message || 'Unknown error'}`,
          'error'
        );
      }
    } catch (error) {
      console.error('Product submission error:', error);
      showNotification(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const loading = loadingCategories || loadingProduct;
  
  // Clean up object URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up any created object URLs when unmounting
      images.forEach(image => {
        if (image.startsWith('blob:')) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, [images]);
  
  if (loading) {
    return <CircularProgress />;
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditMode ? 'Edit Product' : 'Create New Product'}
      </Typography>
      
      {isEditMode && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Created by: {createdBy || 'Unknown'} on {new Date(createdAt).toLocaleString()}
          </Typography>
          {lastModifiedBy && (
            <Typography variant="body2" color="text.secondary">
              Last modified by: {lastModifiedBy} on {new Date(updatedAt).toLocaleString()}
            </Typography>
          )}
        </Box>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Basic Information</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Product Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.categoryId}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    {...field}
                    label="Category"
                  >
                    <MenuItem value={0} disabled>Select a category</MenuItem>
                    {categories?.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <FormHelperText>{errors.categoryId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Pricing & Inventory</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stock"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Specifications</Typography>
            <SpecificationsEditor
              specifications={specifications}
              onChange={setSpecifications}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Images</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {isEditMode 
                ? 'Upload new images to add to the product. Existing images will be preserved.'
                : 'Upload images for the product. You can add multiple images.'}
            </Typography>
            <ImageUpload
              images={images}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
            />
            {imageFiles.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {imageFiles.length} new image(s) will be uploaded when you save the product.
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="button" 
                onClick={() => navigate('/products')} 
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm; 