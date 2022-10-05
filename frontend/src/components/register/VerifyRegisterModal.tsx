import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import ResendCodeButton from './ResendCodeButton';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

type Props = {
  username: string,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  p: 4,
};

const VerifyRegisterModal = (props: Props) => {
  const handleOpen = () => props.setOpen(true);
  const [showErrorMessage, setShowErrorMessage] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const handleClose = () => props.setOpen(false);
  const navigate = useNavigate();

  const displayError = (message: string) => {
    setShowErrorMessage(true);
    setErrorMessage(message);
  }

  async function handleConfirm() {
    try {
      console.log(props.username, code)
      await Auth.confirmSignUp(props.username, code);
      handleClose();
      navigate('/login');
    } catch (error) {
      console.log('error confirming sign up', error);
      // displayError(error.message)
    }
  }


  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Email Address
          </Typography>
          <Typography color="error" variant="body1" sx={{ marginTop: 1, display: `${showErrorMessage ? "block" : "none"}` }}>
            Error: {errorMessage}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            We've sent a confirmation code to your email address. Please enter it below.
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="Confirmation Code"
            name="code"
            autoFocus
            onChange={(e) => { setCode(e.target.value) }}
            InputProps={{ endAdornment: <ResendCodeButton /> }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            color="secondary"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default VerifyRegisterModal