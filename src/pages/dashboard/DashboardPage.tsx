import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { Statistics, SystemHealth, RecentActivity, QuickActions } from '../../components/dashboard';

const DashboardPage: React.FC = () => {
  // This is mock data - in a real application, this would come from API calls
  const productStats = {
    totalProducts: 120,
    activeProducts: 98,
    lowStockProducts: 12,
    productsByCategory: [
      { categoryName: 'Laptops', count: 32 },
      { categoryName: 'Mobile Phones', count: 45 },
      { categoryName: 'Accessories', count: 28 },
      { categoryName: 'Audio', count: 15 }
    ]
  };

  const recentProducts = [
    {
      id: 1,
      name: 'MacBook Pro 16"',
      description: 'Apple laptop with M1 chip',
      price: 1999.99,
      category: { id: 1, name: 'Laptops', description: '', status: 'ACTIVE' } as any,
      specifications: '{}',
      images: [],
      status: 'ACTIVE' as const,
      stock: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'iPhone 13 Pro',
      description: 'Latest Apple smartphone',
      price: 999.99,
      category: { id: 2, name: 'Mobile Phones', description: '', status: 'ACTIVE' } as any,
      specifications: '{}',
      images: [],
      status: 'ACTIVE' as const,
      stock: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome to the Electronics Store Admin Dashboard.
        </Typography>
      </Box>

      <Statistics productStats={productStats} />

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <SystemHealth />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivity recentProducts={recentProducts} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <QuickActions />
      </Box>
    </Container>
  );
};

export default DashboardPage; 