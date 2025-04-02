import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProductList from '../../components/products/ProductList';

const ProductsPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button 
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/products/new"
        >
          Add Product
        </Button>
      </Box>
      
      <ProductList />
    </Container>
  );
};

export default ProductsPage; 