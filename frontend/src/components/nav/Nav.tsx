import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import ProfileMenu from './ProfileMenu';
import TextLink from '../TextLink';
import { currentAuthenticatedUser } from '../../util/currentAuthenticatedUser';
import { red } from '@mui/material/colors';

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

type Props = {}

const Nav = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [username, setUsername] = React.useState<string>("");
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [searchbarValue, setSearchbarValue] = React.useState("");
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  /**
   * Opens profile menu
   *
   * @param event react mouse event
   */
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes mobile menu
   */
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  /**
   * Closes menu
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  /**
   * Opens mobile menu
   *
   * @param event react mouse event
   */
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  /**
   * Toggles sidebar opening state to given state
   *
   * @param open open state to toggle to
   * @returns function to toggle sidebar state
   */
  const toggleSidebar = (open: boolean) =>
    /**
     * Toggles sidebar opening state to given state
     *
     * @param event react keyboard or mouse event
     */
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setSidebarOpen(open);
    };

  React.useEffect(() => {
    /**
     * Loads username from logged in user and sets navbar logged in/out state
     */
    const setUserData = async () => {
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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar style={{ boxShadow: 'none' }} position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              onClick={() => { navigate('/') }}
              sx={{ display: { xs: 'block', sm: 'block', md: 'block' }, cursor: 'pointer' }}
            >
              Instacook
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Find Recipes"
                onKeyPress={(event) => {
                  event.key === 'Enter' && navigate({
                    pathname: '/search',
                    search: '?query=' + searchbarValue,
                  })
                }}
                onChange={(e) => { setSearchbarValue(e.target.value) }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            {loggedIn ?
              <>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, marginRight: 2 }}>
                  <TextLink text='Your Feed' route="/feed" />
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
                      <Avatar alt={username} sx={{ bgcolor: red[500] }}>
                        {username.charAt(0).toUpperCase()}
                      </Avatar>
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

export default Nav;