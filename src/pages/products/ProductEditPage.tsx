import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import ProductForm from '../../components/products/ProductForm';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewProduct = !id;

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isNewProduct ? 'Add New Product' : `Edit Product #${id}`}
        </Typography>
        
        <ProductForm />
      </Box>
    </Container>
  );
};

export default ProductEditPage; 