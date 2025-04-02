import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  IconButton, 
  Grid, 
  Paper, 
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface SpecificationsEditorProps {
  specifications: Record<string, string>;
  onChange: (specifications: Record<string, string>) => void;
}

const SpecificationsEditor: React.FC<SpecificationsEditorProps> = ({ specifications, onChange }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  const handleAddSpecification = () => {
    if (!key.trim()) {
      setError('Specification name is required');
      return;
    }
    
    if (!value.trim()) {
      setError('Specification value is required');
      return;
    }
    
    // If key already exists, show error
    if (specifications[key] !== undefined) {
      setError(`Specification "${key}" already exists`);
      return;
    }
    
    // Add the new specification
    const updatedSpecs = {
      ...specifications,
      [key]: value
    };
    
    onChange(updatedSpecs);
    
    // Reset form fields
    setKey('');
    setValue('');
    setError('');
  };
  
  const handleRemoveSpecification = (keyToRemove: string) => {
    const updatedSpecs = { ...specifications };
    delete updatedSpecs[keyToRemove];
    onChange(updatedSpecs);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpecification();
    }
  };
  
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Specification Name"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. Processor, RAM, Display Size"
            onKeyPress={handleKeyPress}
            error={!!error && !key.trim()}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Specification Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Intel i7, 16GB, 15.6 inches"
            onKeyPress={handleKeyPress}
            error={!!error && !value.trim()}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleAddSpecification}
            startIcon={<AddIcon />}
            sx={{ height: '100%' }}
          >
            Add
          </Button>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          </Grid>
        )}
      </Grid>
      
      <Box sx={{ mt: 2 }}>
        {Object.keys(specifications).length > 0 ? (
          <List>
            {Object.entries(specifications).map(([specKey, specValue]) => (
              <ListItem key={specKey} divider>
                <ListItemText
                  primary={specKey}
                  secondary={specValue}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    color="error"
                    onClick={() => handleRemoveSpecification(specKey)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No specifications added yet
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default SpecificationsEditor; 