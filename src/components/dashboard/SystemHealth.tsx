import { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { HealthService, HealthStatus, HealthInfo } from '../../services/health.service';
import { useApiRequest } from '../../hooks/useApiRequest';

const SystemHealth = () => {
  const { 
    data: healthStatus, 
    loading: loadingStatus, 
    error: statusError, 
    execute: fetchHealthStatus 
  } = useApiRequest<HealthStatus, []>(HealthService.getHealthStatus);
  
  const { 
    data: healthInfo, 
    loading: loadingInfo, 
    error: infoError, 
    execute: fetchHealthInfo 
  } = useApiRequest<HealthInfo, []>(HealthService.getHealthInfo);
  
  useEffect(() => {
    fetchHealthStatus();
    fetchHealthInfo();
  }, [fetchHealthStatus, fetchHealthInfo]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UP':
        return <CheckCircleIcon color="success" />;
      case 'DOWN':
        return <ErrorIcon color="error" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP':
        return 'success';
      case 'DOWN':
        return 'error';
      default:
        return 'warning';
    }
  };
  
  const isLoading = loadingStatus || loadingInfo;
  const hasError = statusError || infoError;
  
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>System Health</Typography>
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  if (hasError) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>System Health</Typography>
          <Typography color="error">
            Error loading system health information
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>System Health</Typography>
        
        {healthStatus && (
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={1}>
                  {getStatusIcon(healthStatus.status)}
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Overall Status: 
                    <Chip 
                      label={healthStatus.status} 
                      color={getStatusColor(healthStatus.status) as "success" | "error" | "warning"}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </Grid>
              
              {healthStatus.components && Object.entries(healthStatus.components).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Box display="flex" alignItems="center">
                    {getStatusIcon(value.status)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {key}: 
                      <Chip 
                        label={value.status} 
                        color={getStatusColor(value.status) as "success" | "error" | "warning"}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {healthInfo && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>System Information</Typography>
            <Grid container spacing={2}>
              {healthInfo.version && (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="textSecondary">Version</Typography>
                  <Typography variant="body1">{healthInfo.version}</Typography>
                </Grid>
              )}
              
              {healthInfo.environment && (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="textSecondary">Environment</Typography>
                  <Typography variant="body1">{healthInfo.environment}</Typography>
                </Grid>
              )}
              
              {healthInfo.uptime && (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="textSecondary">Uptime</Typography>
                  <Typography variant="body1">{healthInfo.uptime}</Typography>
                </Grid>
              )}
              
              {healthInfo.serverTime && (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="textSecondary">Server Time</Typography>
                  <Typography variant="body1">{healthInfo.serverTime}</Typography>
                </Grid>
              )}
              
              {healthInfo.memory && (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="textSecondary">Memory (Used/Total)</Typography>
                  <Typography variant="body1">
                    {healthInfo.memory.used} / {healthInfo.memory.total}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealth; 