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
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import ProfileMenu from './ProfileMenu';
import TextLink from '../TextLink';
import { currentAuthenticatedUser } from '../../util/currentAuthenticatedUser';

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
  const [username, setUsername] = React.useState<string>("");
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [searchbarValue, setSearchbarValue] = React.useState("");
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

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

  React.useEffect(() => {
    const setUserData = async () => {
      console.log("setUserData in Nav.tsx called");
      try {
        const { user } = await currentAuthenticatedUser();
        setUsername(user);
        setLoggedIn(true);
        console.log("Nav: Logged In User: ", username);
      } catch (e) {
        if (typeof e === "string") {
          console.log(e);
        } else if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log(e);
        }
        setLoggedIn(false);
      }
    }
    setUserData()
  }, [navigate, username])

  return (
    <>
      <Drawer
        open={sidebarOpen}
        onClose={toggleSidebar(false)}
      >
        <Sidebar loggedIn={loggedIn} toggleSidebar={toggleSidebar} />
      </Drawer>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar style={{ boxShadow: 'none' }} position="static">
          <Toolbar>
            {loggedIn && <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={toggleSidebar(true)}
            >
              <MenuIcon />
            </IconButton>}
            <Typography
              variant="h6"
              noWrap
              onClick={() => { navigate('/feed') }}
              sx={{ display: { xs: 'none', sm: 'none', md: 'block' }, cursor: 'pointer' }}
            >
              Instacook
            </Typography>
            {loggedIn && <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Find Users"
                onKeyPress={(event) => {
                  event.key === 'Enter' && navigate('/profile/' + searchbarValue)
                }}
                onChange={(e) => { setSearchbarValue(e.target.value) }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>}
            <Box sx={{ flexGrow: 1 }} />
            {loggedIn ?
              <>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: 2 }}>
                  <TextLink text='Discover' route="/" />
                </Box>
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
                      <Avatar alt={username} src={''} />
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
          username={username}
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          setMobileMoreAnchorEl={setMobileMoreAnchorEl}
        />
        <ProfileMenu
          handleMenuClose={handleMenuClose}
          username={username}
          anchorEl={anchorEl}
        />
      </Box>
    </>
  );
}
