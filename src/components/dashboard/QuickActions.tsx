import React from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { Add, ViewList, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              fullWidth
              onClick={() => navigate('/products/new')}
            >
              Add Product
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ViewList />}
              fullWidth
              onClick={() => navigate('/products')}
            >
              View Products
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<BarChart />}
              fullWidth
              onClick={() => navigate('/categories')}
            >
              Manage Categories
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions; 