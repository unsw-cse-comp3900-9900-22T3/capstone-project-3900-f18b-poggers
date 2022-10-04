import React from 'react';
import { useState } from 'react';
import { Button, Typography, Container, Grid, Box } from '@mui/material';
import { padding } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';

type Props = {}

const ProfileRecipe = (props: Props) => {

  const tagStyles = {
    backgroundColor: 'gray',
    padding: 1,
    borderRadius: 2,
    color: '#FFF',
    margin: 0.5,
  }

  return (
        <Grid 
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            border: 1,
            borderRadius: '15px',
            marginTop: 2,
          }}
        >

          {/* Recipe thumbnail */}
          <Grid md={4}>
            <Box
              component="img"
              sx={{
                minHeight: 200,
                minWeight: 200,
                maxHeight: 200,
                maxWidth: 200,
                objectFit: "cover",
              }}
              onClick={() => alert('Recipe page is yet to be implemented')}
              alt="Profile Image"
              // src="https://addapinch.com/wp-content/uploads/2017/07/old-fashioned-vanilla-ice-cream-recipe-DSC_4239.jpg" 
              // src="https://i.redd.it/a1zcxisgjls71.png"
              src="https://images.unsplash.com/photo-1615003162333-d3ff3ce1f0f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dWx0cmElMjB3aWRlfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
            />

          </Grid>

          {/* Recipe title and description */}
          <Grid item md={6}>
            <Grid item>
              <Typography variant="h3">
                Bing Chilling
              </Typography>

              <Typography variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum, erat ac aliquam scelerisque, est enim luctus leo, a pretium diam nisl nec eros. Cras sit amet viverra eros.
              </Typography>
            </Grid>

            {/* Tags and likes */}
            <Grid 
              // item
              container
              direction="row"
              alignItems="flex-end"
            >
              <Box sx={tagStyles}>
                Tag
              </Box>

              <Box sx={tagStyles}>
                Tag
              </Box>

              <Box sx={tagStyles}>
                Tag
              </Box>

              <Box sx={tagStyles}>
                <Grid container direction="row" alignItems="center">
                  <FavoriteIcon/> 9999
                </Grid>
              </Box>

            </Grid>
          </Grid>

        </Grid>
    

  )
}

export default ProfileRecipe