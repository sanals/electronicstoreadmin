import { useEffect, useState } from 'react';
import { 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Chip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { CategoryResponse, CategoryCreateRequest } from '../../types/api-responses';
import { CategoryService } from '../../services/category.service';
import { useApiRequest } from '../../hooks/useApiRequest';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showNotification } from '../../utils/notification';
import ConfirmDialog from '../shared/ConfirmDialog';

// Form validation schema
const schema = yup.object({
  name: yup.string().required('Category name is required'),
  description: yup.string().required('Description is required'),
}).required();

const CategoryList = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form setup - MOVED HERE BEFORE ANY CONDITIONALS
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CategoryCreateRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: ''
    }
  });
  
  // Get categories
  const { 
    data: categories, 
    loading, 
    error, 
    execute: fetchCategories 
  } = useApiRequest<CategoryResponse[], []>(
    CategoryService.getAllCategories,
    false
  );
  
  // Create category
  const {
    loading: creating,
    execute: createCategory
  } = useApiRequest<{ id: number }, [CategoryCreateRequest]>(
    CategoryService.createCategory,
    true,
    'Category created successfully'
  );
  
  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // Handle opening the create dialog
  const handleOpenDialog = () => {
    setSelectedCategory(null);
    reset({
      name: '',
      description: ''
    });
    setOpenDialog(true);
  };
  
  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle form submission
  const onSubmit = async (data: CategoryCreateRequest) => {
    const result = await createCategory(data);
    if (result && result.status === 'SUCCESS') {
      handleCloseDialog();
      fetchCategories();
    }
  };
  
  // Handle category deletion
  const handleDelete = async (category: CategoryResponse) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      const result = await CategoryService.deleteCategory(selectedCategory.id);
      
      if (result && result.status === 'SUCCESS') {
        showNotification('Category deleted successfully', 'success');
        fetchCategories();
      } else {
        showNotification(`Failed to delete category: ${result?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification(`Error deleting category: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };
  
  // Show loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error
  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#fff8f8' }}>
        <Typography color="error">Error: {error}</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => fetchCategories()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Paper>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Categories</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/categories/new"
        >
          New Category
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Last Modified By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={category.status} 
                      color={category.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`Created on ${new Date(category.createdAt).toLocaleString()}`}>
                      <span>{category.createdBy || 'Unknown'}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`Modified on ${new Date(category.updatedAt).toLocaleString()}`}>
                      <span>{category.lastModifiedBy || 'Unknown'}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small"
                      color="primary" 
                      component={Link} 
                      to={`/categories/${category.id}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="error" 
                      onClick={() => handleDelete(category)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Create Category Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={creating}
            >
              {creating ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This may impact products in this category.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedCategory(null);
        }}
        confirmButtonText="Delete"
        confirmButtonColor="error"
      />
    </Box>
  );
};

export default CategoryList; 