import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'

type Props = {
  // item text
  text: string
}

const SidebarButtonItem = (props: Props) => {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <ListItemText primary={props.text} />
        </ListItemButton>
      </ListItem>
    </List>
  )
}

export default SidebarButtonItem