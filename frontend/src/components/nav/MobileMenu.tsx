import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Props = {
  handleMenuClose: () => void,
  username: string,
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void,
  setMobileMoreAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
  mobileMoreAnchorEl: HTMLElement | null
}

const MobileMenu = (props: Props) => {
  const navigate = useNavigate();
  const isMobileMenuOpen = Boolean(props.mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    props.setMobileMoreAnchorEl(null);
  };

  const closeMenuNavigate = (link: string) => {
    props.handleMenuClose();
    navigate(link);
  }

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('token');

      // close menu, log out and redirect to /login
      props.handleMenuClose();
      navigate('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <Menu
      anchorEl={props.mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id='primary-search-account-menu-mobile'
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => closeMenuNavigate('/profile/' + props.username)}>Signed in as {props.username}</MenuItem>
      <Divider />
      <MenuItem onClick={() => { closeMenuNavigate('/') }}>Discover</MenuItem>
      <Divider />
      <MenuItem onClick={() => { closeMenuNavigate('/createrecipe') }}>Upload a Recipe</MenuItem>
      <Divider />
      <MenuItem onClick={() => closeMenuNavigate('/profile/' + props.username)}>
        Your Profile
      </MenuItem>
      <MenuItem onClick={() => { closeMenuNavigate('/feed') }}>Your Feed</MenuItem>
      <MenuItem onClick={() => { closeMenuNavigate('/savedrecipes') }}>Your Recipe Books</MenuItem>
      <Divider />
      <MenuItem onClick={() => handleSignOut()}>Sign Out</MenuItem>
    </Menu >
  )
}

export default MobileMenu