import React, { forwardRef } from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';
import { Notification as NotificationType } from '../../types/common.types';

interface NotificationComponentProps {
  notification: NotificationType | null;
  onClose: () => void;
}

const CustomAlert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <Alert elevation={6} ref={ref} variant="filled" {...props} />
));

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  notification,
  onClose
}) => {
  if (!notification) return null;

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={notification.autoHideDuration || 5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <CustomAlert
        onClose={onClose}
        severity={notification.type}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </CustomAlert>
    </Snackbar>
  );
};

export default NotificationComponent; 