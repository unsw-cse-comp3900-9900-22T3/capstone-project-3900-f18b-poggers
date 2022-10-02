import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button, Divider, Drawer, Tooltip } from '@mui/material';
import avatar from '../static/images/avatar.jpg'
import SidebarButtonItem from './SidebarButtonItem';
import SidebarSubheading from './SidebarSubheading';
import { Link } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Nav() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loggedInUsername, setLoggedInUsername] = React.useState<string>("Matthew");
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const toggleSidebar = (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setSidebarOpen(open);
    };


  const menuId = 'primary-search-account-menu';

  const renderSidebar = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleSidebar(false)}
      onKeyDown={toggleSidebar(false)}
    >
      {!loggedIn && <>
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
  );

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Signed in as {loggedInUsername}</MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>Your Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>Your Recipes</MenuItem>
      <MenuItem onClick={handleMenuClose}>Your Liked Recipes</MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>Account Settings</MenuItem>
      <MenuItem onClick={handleMenuClose}>Preferences</MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>Sign Out</MenuItem>
    </Menu>

  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Signed in as {loggedInUsername}</MenuItem>
      <Divider />
      <Divider />
      <MenuItem onClick={handleProfileMenuOpen}>
        Your Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>Your Recipes</MenuItem>
      <MenuItem onClick={handleMenuClose}>Your Liked Recipes</MenuItem>
      <Divider></Divider>
      <MenuItem onClick={handleMenuClose}>Account Settings</MenuItem>
      <MenuItem onClick={handleMenuClose}>Preferences</MenuItem>
      <Divider></Divider>
      <MenuItem onClick={handleMenuClose}>Sign Out</MenuItem>
    </Menu >
  );

  return (
    <>
      <Drawer
        open={sidebarOpen}
        onClose={toggleSidebar(false)}
      >
        {renderSidebar()}
      </Drawer>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={toggleSidebar(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
              onClick={() => setLoggedIn(!loggedIn)} // remove this later
            >
              Instacook
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Find Recipes or Users"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            {loggedIn ?
              <>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Tooltip title="Account">
                    <IconButton
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <Avatar alt={loggedInUsername} src={avatar} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
              </>
              :
              <>
                <Button
                  sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
                  color="secondary" variant="contained"
                  component={Link}
                  to={"/login"}
                >
                  <Typography align="center">Log In</Typography>
                </Button>
              </>}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </>
  );
}
