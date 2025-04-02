import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import CategoryForm from '../../components/categories/CategoryForm';

const CategoryEditPage: React.FC = () => {
  const { id } = useParams();
  const isNewCategory = !id;

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isNewCategory ? 'Add New Category' : `Edit Category #${id}`}
        </Typography>
        <CategoryForm />
      </Box>
    </Container>
  );
};

export default CategoryEditPage; 