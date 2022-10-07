import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import SidebarSubheading from './SidebarSubheading';
import SidebarButtonItem from './SidebarButtonItem';

type Props = {
  loggedIn: boolean,
  toggleSidebar: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void
}

const Sidebar = (props: Props) => {
  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={props.toggleSidebar(false)}
      onKeyDown={props.toggleSidebar(false)}
    >
      {!props.loggedIn && <>
        <Box sx={{ padding: 1, display: { xs: 'block', sm: 'block', md: 'none' } }}>
          <Button
            variant="contained"
            sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, width: '100%', marginTop: 1 }}
            color="secondary"
            component={Link}
            to={"/login"}
          >
            <Typography align="center">Log In</Typography>
          </Button>
        </Box>
      </>}
      <Divider />

      <SidebarSubheading text="Meals" />
      <SidebarButtonItem text="Breakfast/Brunch Recipes" />
      <SidebarButtonItem text="Dinner Recipes" />
      <SidebarButtonItem text="Lunch Recipes" />
      <Divider />
      <SidebarSubheading text="Meat" />
      <SidebarButtonItem text="Beef Recipes" />
      <SidebarButtonItem text="Chicken Recipes" />
      <SidebarButtonItem text="Pork Recipes" />
      <Divider />
      <SidebarSubheading text="Drinks" />
      <SidebarButtonItem text="Cocktail Recipes" />
      <SidebarButtonItem text="Coffee Recipes" />
      <SidebarButtonItem text="Smoothie Recipes" />
      <SidebarButtonItem text="Tea Recipes" />
      <Divider />
      <SidebarSubheading text="Desserts" />
      <SidebarButtonItem text="Cake Recipes" />
      <SidebarButtonItem text="Cookie Recipes" />
      <SidebarButtonItem text="Ice Cream Recipes" />
      <Divider />
      <SidebarSubheading text="Cuisines" />
      <SidebarButtonItem text="Australian Recipes" />
      <SidebarButtonItem text="Chinese Recipes" />
      <SidebarButtonItem text="Indian Recipes" />
      <SidebarButtonItem text="Middle Eastern Recipes" />
      <SidebarButtonItem text="Vietnamese Recipes" />

    </Box>
  )
}

export default Sidebar