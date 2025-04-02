import React, { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import NotificationComponent from './Notification';
import { useAuth } from '../../hooks/useAuth';
import { Notification } from '../../types/common.types';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoading } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  
  const handleCloseNotification = () => {
    setNotification(null);
  };
  
  if (isLoading) {
    return null; // Or return a loading indicator
  }
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleCloseSidebar}
        drawerWidth={drawerWidth}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Toolbar /> {/* Add spacing for the fixed header */}
        <Outlet />
      </Box>
      <NotificationComponent 
        notification={notification}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};

export default Layout; 