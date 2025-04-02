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

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  description: yup.string().required('Description is required'),
  parentCategoryId: yup.number().nullable().transform((value) => (isNaN(value) ? null : value))
});

// Extended interface to allow null for parentCategoryId
interface CategoryFormData extends Omit<CategoryCreateRequest, 'parentCategoryId'> {
  parentCategoryId?: number | null;
}

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [isActive, setIsActive] = useState<boolean>(true);
  const [createdBy, setCreatedBy] = useState<string>('');
  const [lastModifiedBy, setLastModifiedBy] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      description: '',
      parentCategoryId: null
    }
  });
  
  // Fetch all categories for parent category dropdown
  const { 
    data: categories, 
    loading: loadingCategories, 
    execute: fetchCategories 
  } = useApiRequest<CategorySummary[], []>(CategoryService.getAllCategories);
  
  // Fetch single category for edit mode
  const {
    loading: loadingCategory,
    execute: fetchCategory
  } = useApiRequest<CategoryResponse, [number]>(CategoryService.getCategoryById);
  
  useEffect(() => {
    fetchCategories();
    
    if (isEditMode && id) {
      fetchCategory(parseInt(id)).then(response => {
        if (response?.status === 'SUCCESS' && response.data) {
          const category = response.data;
          reset({
            name: category.name,
            description: category.description,
            parentCategoryId: category.parentCategory?.id || null
          });
          
          setIsActive(category.status === 'ACTIVE');
          setCreatedBy(category.createdBy || '');
          setLastModifiedBy(category.lastModifiedBy || '');
          setCreatedAt(category.createdAt || '');
          setUpdatedAt(category.updatedAt || '');
        }
      });
    }
  }, [isEditMode, id, fetchCategories, fetchCategory, reset]);
  
  const onSubmit = async (data: CategoryFormData) => {
    try {
      showNotification('Saving category...', 'info');
      
      // Convert form data to API request format
      const formData: CategoryCreateRequest = {
        name: data.name,
        description: data.description,
        // Only include parentCategoryId if it's not null
        ...(data.parentCategoryId !== null && { parentCategoryId: data.parentCategoryId })
      };
      
      // Add status to the request
      const requestData = {
        ...formData,
        status: isActive ? 'ACTIVE' : 'INACTIVE'
      };
      
      let response;
      
      if (isEditMode && id) {
        // Update existing category
        response = await CategoryService.updateCategory(parseInt(id), requestData);
      } else {
        // Create new category
        response = await CategoryService.createCategory(requestData);
      }
      
      if (response?.status === 'SUCCESS') {
        showNotification(
          isEditMode ? 'Category updated successfully' : 'Category created successfully',
          'success'
        );
        navigate('/categories');
      } else {
        showNotification(
          `Failed to ${isEditMode ? 'update' : 'create'} category: ${response?.message || 'Unknown error'}`,
          'error'
        );
      }
    } catch (error) {
      console.error('Category submission error:', error);
      showNotification(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };
  
  const loading = loadingCategories || loadingCategory;
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditMode ? 'Edit Category' : 'Create New Category'}
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
          
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
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
            <Controller
              name="parentCategoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Parent Category (Optional)</InputLabel>
                  <Select
                    {...field}
                    label="Parent Category (Optional)"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : Number(e.target.value);
                      field.onChange(value);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories?.filter(cat => !isEditMode || (cat.id !== parseInt(id || '0'))).map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.parentCategoryId && (
                    <FormHelperText error>{errors.parentCategoryId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                />
              }
              label={`Status: ${isActive ? 'Active' : 'Inactive'}`}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="button" 
                onClick={() => navigate('/categories')} 
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                {isEditMode ? 'Update Category' : 'Create Category'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CategoryForm; 