import * as React from 'react';
import { styled } from '@mui/system';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';

const QuantityInput = ({ value, onChange, min = 1, max = 99, availableQuantity }) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange({ target: { value: value + 1 } });
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange({ target: { value: value - 1 } });
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <StyledButton
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <RemoveIcon fontSize="small" />
      </StyledButton>

      <StyledInput
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        style={{ margin: '0 8px', width: '4rem', textAlign: 'center' }}
      />

      <StyledButton
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <AddIcon fontSize="small" />
      </StyledButton>

      {/* Display error if quantity exceeds available stock */}
      {value > availableQuantity && (
        <Typography color="error" variant="caption" sx={{ ml: 2 }}>
          Exceeds available stock
        </Typography>
      )}
    </div>
  );
};

export default QuantityInput;

const StyledButton = styled('button')({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid grey',
  borderRadius: '50%',
  backgroundColor: '#f0f0f0',
  cursor: 'pointer',
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
});

const StyledInput = styled('input')({
  width: '60px',
  padding: '8px',
  textAlign: 'center',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '1rem',
});
