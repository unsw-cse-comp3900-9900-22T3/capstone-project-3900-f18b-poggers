import { Divider, Menu, MenuItem } from '@mui/material'
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

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('token');

      // close menu, log out and redirect to /login
      props.handleMenuClose();
      navigate('/login');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  const closeMenuNavigate = (link: string) => {
    props.handleMenuClose();
    navigate(link);
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
      <MenuItem onClick={() => { closeMenuNavigate('/profile/' + props.username) }}>Signed in as {props.username}</MenuItem>
      <Divider />
      <MenuItem onClick={() => { closeMenuNavigate('/createrecipe') }}>Upload a Recipe</MenuItem>
      <Divider />
      <MenuItem onClick={() => { closeMenuNavigate('/profile/' + props.username) }}>Your Profile</MenuItem>
      <MenuItem onClick={() => { closeMenuNavigate('/feed') }}>Your Feed</MenuItem>
      <MenuItem onClick={() => { closeMenuNavigate('/savedrecipe/') }}>Your Recipe Book</MenuItem>
      <Divider />
      <MenuItem onClick={() => { closeMenuNavigate('/profile/' + props.username) }}>Account Settings</MenuItem>
      <MenuItem onClick={() => { closeMenuNavigate('/profile/' + props.username) }}>Preferences</MenuItem>
      <Divider />
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu >
  )
}

export default ProfileMenu