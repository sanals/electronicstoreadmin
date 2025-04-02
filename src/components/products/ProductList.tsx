import { useEffect, useState } from 'react';
import { 
  Box, 
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { Link, useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/product.service';
import { useApiRequest } from '../../hooks/useApiRequest';
import { ProductResponse } from '../../types/api-responses';
import { showNotification } from '../../utils/notification';
import ConfirmDialog from '../shared/ConfirmDialog';

// Interface for the paginated response structure
interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

const ProductList = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { 
    loading, 
    error, 
    execute: fetchProducts 
  } = useApiRequest<PaginatedResponse<ProductResponse>, []>(
    ProductService.getAllProducts,
    false
  );

  useEffect(() => {
    const loadProducts = async () => {
      console.log('Fetching products...');
      const response = await fetchProducts();
      console.log('API Response:', response);
      
      if (response && response.status === 'SUCCESS') {
        console.log('Product data:', response.data);
        
        // Extract products from the paginated response
        if (response.data && response.data.content) {
          console.log('Setting products from paginated data:', response.data.content);
          setProducts(response.data.content);
        } else {
          console.error('Unexpected response structure:', response.data);
          setProducts([]);
        }
      } else {
        console.error('Failed to get products:', response);
        setProducts([]);
      }
    };
    
    loadProducts();
  }, [fetchProducts]);

  const handleDelete = async (product: ProductResponse) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      const result = await ProductService.deleteProduct(selectedProduct.id);
      
      if (result && result.status === 'SUCCESS') {
        showNotification('Product deleted successfully', 'success');
        // Just remove the product from local state for immediate UI update
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      } else {
        showNotification(`Failed to delete product: ${result?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification(`Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleStatusChange = async (product: ProductResponse) => {
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    try {
      const result = await ProductService.updateProductStatus(
        product.id, 
        newStatus
      );
      
      if (result && result.status === 'SUCCESS') {
        showNotification(`Product ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`, 'success');
        // Update status in local state for immediate UI update
        setProducts(prev => 
          prev.map(p => 
            p.id === product.id ? { ...p, status: newStatus } : p
          )
        );
      } else {
        showNotification(`Failed to update product status: ${result?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Status update error:', error);
      showNotification(`Error updating status: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#fff8f8' }}>
        <Typography color="error">Error: {error}</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => fetchProducts()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>No products found</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/products/new"
        >
          Add Product
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Products</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/products/new"
        >
          Add Product
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Last Modified By</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                <TableCell align="right">{product.stock}</TableCell>
                <TableCell>
                  <Chip 
                    label={product.status} 
                    color={product.status === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{product.createdBy || 'Unknown'}</TableCell>
                <TableCell>{product.lastModifiedBy || 'Unknown'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleStatusChange(product)}
                      color={product.status === 'ACTIVE' ? 'success' : 'default'}
                    >
                      {product.status === 'ACTIVE' ? 
                        <ToggleOnIcon fontSize="small" /> : 
                        <ToggleOffIcon fontSize="small" />
                      }
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(product)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedProduct(null);
        }}
      />
    </Box>
  );
};

export default ProductList; 