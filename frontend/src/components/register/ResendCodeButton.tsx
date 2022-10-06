import React from 'react'
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Auth } from 'aws-amplify';

type Props = {
  displayError: (message: string) => void,
  displayInfo: (message: string) => void,
  username: string
}

const ResendCodeButton = (props: Props) => {
  const resendConfirmationCode = async () => {
    try {
      await Auth.resendSignUp(props.username);
      console.log('code resent successfully');
      props.displayInfo("Code re-sent successfully.")
    } catch (e) {
      console.log('error resending code: ', e);
      if (typeof e === "string") {
        props.displayError(e);
        return;
      } else if (e instanceof Error) {
        props.displayError(e.message);
        return;
      }
    }
  }
  return (
    <IconButton onClick={resendConfirmationCode}>
      <RefreshIcon />
    </IconButton>
  )
}

export default ResendCodeButton