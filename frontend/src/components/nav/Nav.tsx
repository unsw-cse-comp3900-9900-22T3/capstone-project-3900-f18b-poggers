import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button, Drawer, Tooltip } from '@mui/material';
import avatar from '../../static/images/avatar.jpg'
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import ProfileMenu from './ProfileMenu';

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
  const [loggedInUsername, setLoggedInUsername] = React.useState<string>("");
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

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

  return (
    <>
      <Drawer
        open={sidebarOpen}
        onClose={toggleSidebar(false)}
      >
        <Sidebar loggedIn={loggedIn} toggleSidebar={toggleSidebar} />
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
                      aria-controls='primary-search-account-menu'
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
                    aria-controls='primary-search-account-menu-mobile'
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
        <MobileMenu
          handleMenuClose={handleMenuClose}
          handleProfileMenuOpen={handleProfileMenuOpen}
          loggedInUsername={loggedInUsername}
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          setMobileMoreAnchorEl={setMobileMoreAnchorEl}
        />
        <ProfileMenu
          handleMenuClose={handleMenuClose}
          loggedInUsername={loggedInUsername}
          anchorEl={anchorEl}
        />
      </Box>
    </>
  );
}
