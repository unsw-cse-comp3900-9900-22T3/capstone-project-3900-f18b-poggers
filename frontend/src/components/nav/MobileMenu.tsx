import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Divider } from '@mui/material';

type Props = {
  handleMenuClose: () => void,
  username: string,
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void,
  setMobileMoreAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
  mobileMoreAnchorEl: HTMLElement | null
}

const MobileMenu = (props: Props) => {

  const isMobileMenuOpen = Boolean(props.mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    props.setMobileMoreAnchorEl(null);
  };

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
      <MenuItem onClick={props.handleMenuClose}>Signed in as {props.username}</MenuItem>
      <Divider />
      <Divider />
      <MenuItem onClick={props.handleProfileMenuOpen}>
        Your Profile
      </MenuItem>
      <MenuItem onClick={props.handleMenuClose}>Your Recipes</MenuItem>
      <MenuItem onClick={props.handleMenuClose}>Your Liked Recipes</MenuItem>
      <Divider></Divider>
      <MenuItem onClick={props.handleMenuClose}>Account Settings</MenuItem>
      <MenuItem onClick={props.handleMenuClose}>Preferences</MenuItem>
      <Divider></Divider>
      <MenuItem onClick={props.handleMenuClose}>Sign Out</MenuItem>
    </Menu >
  )
}

export default MobileMenu