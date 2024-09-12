import { Button } from '@mui/material';

const SubmitButton = ({ text, ...props }) => {
  return (
    <Button
      sx={{
        backgroundColor: '#F4A261',
        width: '100%',
        padding: '12px',
        marginTop: '16px',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#e07b39',
        },
      }}
      type="submit"
      variant="contained"
      color="primary"
      {...props}
    >
      {text}
    </Button>
  );
};

export default SubmitButton;
