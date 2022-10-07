import { Divider, Menu, MenuItem } from '@mui/material'
import { Auth } from 'aws-amplify'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  handleMenuClose: () => void,
  username: string,
  anchorEl: HTMLElement | null,
}

const ProfileMenu = (props: Props) => {
  const isMenuOpen = Boolean(props.anchorEl);
  const navigate = useNavigate();

  async function handleSignOut() {
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
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id='primary-search-account-menu'
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={props.handleMenuClose}
    >
      <MenuItem onClick={props.handleMenuClose}>Signed in as {props.username}</MenuItem>
      <Divider />
      <MenuItem onClick={props.handleMenuClose}>Your Profile</MenuItem>
      <MenuItem onClick={props.handleMenuClose}>Your Recipes</MenuItem>
      <MenuItem onClick={props.handleMenuClose}>Your Liked Recipes</MenuItem>
      <Divider />
      <MenuItem onClick={props.handleMenuClose}>Account Settings</MenuItem>
      <MenuItem onClick={props.handleMenuClose}>Preferences</MenuItem>
      <Divider />
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu>
  )
}

export default ProfileMenu