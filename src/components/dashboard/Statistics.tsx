import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  productsByCategory: {
    categoryName: string;
    count: number;
  }[];
}

interface StatisticsProps {
  productStats: ProductStats;
}

const Statistics: React.FC<StatisticsProps> = ({ productStats }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h4" component="div">
              {productStats.totalProducts}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Products
            </Typography>
            <Typography variant="h4" component="div">
              {productStats.activeProducts}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Low Stock Products
            </Typography>
            <Typography variant="h4" component="div" color="error">
              {productStats.lowStockProducts}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Categories
            </Typography>
            <Typography variant="h4" component="div">
              {productStats.productsByCategory.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Products by Category
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {productStats.productsByCategory.map((category) => (
                <Card key={category.categoryName} sx={{ flex: '1 0 200px', maxWidth: 250 }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {category.categoryName}
                    </Typography>
                    <Typography variant="h6" component="div">
                      {category.count} products
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Statistics; 