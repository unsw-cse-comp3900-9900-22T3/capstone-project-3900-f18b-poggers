import { Divider, Menu, MenuItem } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  // function to close menu
  handleMenuClose: () => void,

  // username of user
  username: string,

  // element to anchor menu to
  anchorEl: HTMLElement | null,
}

const ProfileMenu = (props: Props) => {
  const isMenuOpen = Boolean(props.anchorEl);
  const navigate = useNavigate();

  /**
   * Signs user out
   */
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

  /**
   * Closes menu and redirects to given link/route
   *
   * @param link route to redirect to
   */
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
      <MenuItem onClick={() => { closeMenuNavigate('/savedrecipes') }}>Your Recipe Books</MenuItem>
      <Divider />
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu >
  )
}

export default ProfileMenu