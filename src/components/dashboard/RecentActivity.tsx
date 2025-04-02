import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

interface Product {
  id: number;
  name: string;
  price: number;
  category: {
    name: string;
  };
  updatedAt: string;
}

interface RecentActivityProps {
  recentProducts: Product[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentProducts }) => {
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        
        {recentProducts.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No recent activity to display
          </Typography>
        ) : (
          <List>
            {recentProducts?.map((product, index) => (
              <React.Fragment key={product.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={product.name}
                    secondary={`${product.category.name} - $${product.price.toFixed(2)} - ${formatDate(product.updatedAt)}`}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity; 