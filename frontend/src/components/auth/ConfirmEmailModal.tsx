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
  email: string,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  redirectPage: string

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

const ConfirmEmailModal = (props: Props) => {
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const handleClose = () => props.setOpen(false);
  const [errorColorOn, setErrorColorOn] = React.useState(true);
  const navigate = useNavigate();

  const displayInfo = (message: string) => {
    setErrorColorOn(false);
    setShowErrorMessage(true);
    setErrorMessage(message);
  }

  const displayError = (message: string) => {
    setErrorColorOn(true);
    setShowErrorMessage(true);
    setErrorMessage(message);
  }

  const handleConfirm = async () => {
    try {
      console.log(props.email, code)
      await Auth.confirmSignUp(props.email, code);
      handleClose();
      navigate(props.redirectPage);
    } catch (e) {
      console.log('error confirming sign up', e);
      if (typeof e === "string") {
        displayError(e);
        return;
      } else if (e instanceof Error) {
        displayError(e.message);
        return;
      }
    }
  }

  return (
    <div>
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
          <Typography color={errorColorOn ? "error" : "secondary"} variant="body1" sx={{ display: `${showErrorMessage ? "block" : "none"}` }}>
            {errorMessage}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
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
            InputProps={{ endAdornment: <ResendCodeButton displayError={displayError} displayInfo={displayInfo} username={props.email} /> }}
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

export default ConfirmEmailModal