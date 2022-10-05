import React from 'react'
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

type Props = {}

const ResendCodeButton = (props: Props) => {
  return (
    <IconButton>
      <RefreshIcon />
    </IconButton>
  )
}

export default ResendCodeButton