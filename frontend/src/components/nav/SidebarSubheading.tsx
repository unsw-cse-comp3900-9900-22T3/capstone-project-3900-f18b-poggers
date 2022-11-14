import { List, ListItem, ListItemText, Typography } from '@mui/material'
import React from 'react'

type Props = {
  // subheading text
  text: string
}

const SidebarSubheading = (props: Props) => {
  return (
    <List sx={{ paddingBottom: 0 }}>
      <ListItem sx={{ paddingBottom: 0, paddingTop: 0 }} >
        <ListItemText>
          <Typography align="center" sx={{ fontWeight: 'bold' }}>{props.text}</Typography>
        </ListItemText>
      </ListItem>
    </List >
  )
}

export default SidebarSubheading