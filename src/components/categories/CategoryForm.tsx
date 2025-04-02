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
  Paper,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CategoryCreateRequest, 
  CategoryUpdateRequest, 
  CategoryResponse,
  CategorySummary 
} from '../../types/api-responses';
import { CategoryService } from '../../services/category.service';
import { useApiRequest } from '../../hooks/useApiRequest';
import { showNotification } from '../../utils/notification';

// Add Props interface at the top of the file
interface Props {
  categories: any[];
  mode?: 'create' | 'edit';
  categoryId?: number;
}

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  description: yup.string().required('Description is required'),
  parentCategoryId: yup.number().nullable().transform((value) => (isNaN(value) ? null : value))
});

// Extended interface to allow null for parentCategoryId
interface CategoryFormData extends Omit<CategoryCreateRequest, 'parentCategoryId'> {
  parentCategoryId?: number | null;
  status?: "ACTIVE" | "INACTIVE";
  imageUrl?: string;
}

const CategoryForm: React.FC<Props> = ({ categories, mode = 'create', categoryId }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      parentCategoryId: null
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();

  // Initialize form if editing
  useEffect(() => {
    if (mode === 'edit' && categoryId) {
      setLoading(true);
      
      CategoryService.getCategoryById(categoryId)
        .then(response => {
          if (response.status === 'SUCCESS' && response.data) {
            const categoryData = response.data;
            
            reset({
              name: categoryData.name,
              description: categoryData.description,
              parentCategoryId: categoryData.parentCategory?.id || null,
              status: categoryData.status,
              imageUrl: categoryData.imageUrl
            });
            
            if (categoryData.imageUrl) {
              setImagePreview(categoryData.imageUrl);
            }
          }
        })
        .catch(error => {
          console.error('Error fetching category details:', error);
          showNotification('Error fetching category details', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [mode, categoryId, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    setSuccess(false);
    
    try {
      let response;
      
      // If we have an image, use the multipart form endpoints
      if (selectedImage) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        
        if (data.parentCategoryId) {
          formData.append('parentCategoryId', data.parentCategoryId.toString());
        }
        
        formData.append('image', selectedImage);
        
        if (mode === 'edit' && categoryId) {
          response = await CategoryService.updateCategoryWithImage(categoryId, formData);
        } else {
          response = await CategoryService.createCategoryWithImage(formData);
        }
      } else {
        // Use regular JSON endpoints
        const categoryData: CategoryCreateRequest | CategoryUpdateRequest = {
          name: data.name,
          description: data.description,
          parentCategoryId: data.parentCategoryId || undefined,
          imageUrl: data.imageUrl
        };
        
        if (mode === 'edit' && categoryId) {
          response = await CategoryService.updateCategory(categoryId, categoryData);
        } else {
          response = await CategoryService.createCategory(categoryData);
        }
      }
      
      if (response.status === 'SUCCESS') {
        setSuccess(true);
        showNotification(`Category ${mode === 'edit' ? 'updated' : 'created'} successfully`, 'success');
        
        // Navigate back after a short delay
        setTimeout(() => {
          navigate('/categories');
        }, 1500);
      } else {
        showNotification(response.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      showNotification('Failed to submit category', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && mode === 'edit') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {mode === 'edit' ? 'Edit Category' : 'Create New Category'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Category Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="parent-category-label">Parent Category</InputLabel>
              <Controller
                name="parentCategoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="parent-category-label"
                    label="Parent Category"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories
                      .filter(cat => mode !== 'edit' || cat.id !== Number(categoryId)) // Filter out current category when editing
                      .map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              {errors.parentCategoryId && (
                <FormHelperText error>{errors.parentCategoryId.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Category Image
            </Typography>
            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
            </Box>
            
            {imagePreview && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Image Preview:
                </Typography>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Category Preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </Box>
            )}
            
            {!selectedImage && (
              <TextField
                fullWidth
                label="Or enter image URL"
                {...register('imageUrl')}
              />
            )}
          </Grid>
          
          {mode === 'edit' && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value === 'ACTIVE'}
                        onChange={(e) => field.onChange(e.target.checked ? 'ACTIVE' : 'INACTIVE')}
                      />
                    )}
                  />
                }
                label="Active"
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  mode === 'edit' ? 'Update Category' : 'Create Category'
                )}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/categories')}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CategoryForm; 