import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Import pages from the restructured directories
import { LoginPage } from './pages/auth';
import { DashboardPage } from './pages/dashboard';
import { NotFoundPage } from './pages';
import { ProductsPage, ProductEditPage } from './pages/products';
import { CategoriesPage, CategoryEditPage } from './pages/categories';
import { UsersPage, UserEditPage } from './pages/users';
import { SettingsPage } from './pages/settings';

// Import shared components
import { ErrorBoundary } from './components/shared';
import { ProtectedRoute, AuthProvider } from './components/auth';
import { Layout } from './components/shared';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  console.log('App rendering with proper routing and components');
  
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected routes inside Layout */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<DashboardPage />} />
                
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<ProductEditPage />} />
                <Route path="/products/:id" element={<ProductEditPage />} />
                
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/new" element={<CategoryEditPage />} />
                <Route path="/categories/:id" element={<CategoryEditPage />} />
                
                <Route path="/users" element={
                  <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <UsersPage />
                  </ProtectedRoute>
                } />
                <Route path="/users/new" element={
                  <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <UserEditPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              
              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 