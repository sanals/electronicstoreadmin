/**
 * Simple notification system using alert for now
 * Can be replaced with toast or Material-UI Snackbar in the future
 * 
 * @param message The message to display
 * @param type Type of notification (info, success, warning, error)
 */
export const showNotification = (
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // For now, use simple alerts for critical errors
  if (type === 'error') {
    alert(`Error: ${message}`);
  }
  
  // In a real implementation, this would use a proper notification system
  // like Material-UI Snackbar or react-toastify
}; 