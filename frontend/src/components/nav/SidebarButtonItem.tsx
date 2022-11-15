import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useNavigate } from 'react-router-dom'

type Props = {
  // button item text
  text: string,

  // tag id to search for
  tagId: string
}

const SidebarButtonItem = (props: Props) => {
  const navigate = useNavigate();
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          sx={{ paddingTop: 0, paddingBottom: 0 }}
          onClick={() => navigate('/search?query=&page=1&tags=' + props.tagId)}
        >
          <ListItemText primary={props.text} />
        </ListItemButton>
      </ListItem>
    </List>
  )
}

export default SidebarButtonItem