import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryForm from '../../components/categories/CategoryForm';
import { CategoryService } from '../../services/category.service';
import { CategorySummary } from '../../types/api-responses';
import { showNotification } from '../../utils/notification';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const CategoryEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCategory = !id || id === 'new';
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all categories for parent category dropdown
    setLoading(true);
    CategoryService.getAllCategories()
      .then(response => {
        if (response?.status === 'SUCCESS' && response.data) {
          setCategories(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        showNotification('Failed to load categories', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    navigate('/categories');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back to Categories
          </Button>
          <Typography variant="h4" component="h1">
            {isNewCategory ? 'Add New Category' : `Edit Category #${id}`}
          </Typography>
        </Box>
        
        <CategoryForm 
          categories={categories} 
          mode={isNewCategory ? 'create' : 'edit'} 
          categoryId={!isNewCategory && id ? parseInt(id) : undefined} 
        />
      </Box>
    </Container>
  );
};

export default CategoryEditPage; 