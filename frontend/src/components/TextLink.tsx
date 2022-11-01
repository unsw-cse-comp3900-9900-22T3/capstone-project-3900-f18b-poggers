import { Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  text: string,
  route: string,
}

const TextLink = (props: Props) => {
  const navigate = useNavigate();
  return (
    <Typography sx={{ cursor: 'pointer', ":hover": { color: "#91989b" } }} onClick={() => { navigate(props.route) }}>
      {props.text}
    </Typography>
  )
}

export default TextLink