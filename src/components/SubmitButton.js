import { Button } from '@mui/material';

const SubmitButton = ({ text, ...props }) => {
  return (
    <Button
      sx={{
        backgroundColor: ' #FF7F50',
        width: '100%',
        padding: '12px',
        marginTop: '16px',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: ' #FF7F50  ',
        },
        display: 'flex',
        justifyContent: 'center',
      }}
      type="submit"
      variant="contained"
      color=" #FF7F50"
      {...props}
    >
      {text}
    </Button>
  );
};

export default SubmitButton;
