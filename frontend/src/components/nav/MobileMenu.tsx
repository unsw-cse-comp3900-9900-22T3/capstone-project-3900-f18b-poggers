import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

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
      await Auth.signOut();

      // close menu, log out and redirect to /login
      props.handleMenuClose();
      navigate('/login');
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
      <MenuItem onClick={() => closeMenuNavigate('/profile')}>Signed in as {props.username}</MenuItem>
      <Divider />
      <MenuItem onClick={() => { closeMenuNavigate('/createrecipe') }}>Upload a Recipe</MenuItem>
      <Divider />
      <MenuItem onClick={() => closeMenuNavigate('/profile')}>
        Your Profile
      </MenuItem>
      <MenuItem onClick={() => closeMenuNavigate('/profile')}>Your Liked Recipes</MenuItem>
      <Divider />
      <MenuItem onClick={() => closeMenuNavigate('/profile')}>Account Settings</MenuItem>
      <MenuItem onClick={() => closeMenuNavigate('/profile')}>Preferences</MenuItem>
      <Divider />
      <MenuItem onClick={() => handleSignOut()}>Sign Out</MenuItem>
    </Menu >
  )
}

export default MobileMenu