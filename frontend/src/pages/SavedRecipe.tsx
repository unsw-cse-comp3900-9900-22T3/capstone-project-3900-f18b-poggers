import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Grid, Box, Avatar } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';
import { Recipe } from '../types/instacook-types';
import { useNavigate, useParams } from 'react-router-dom';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';
import GroupsIcon from '@mui/icons-material/Groups';
import { red } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Clear';

type Props = {}

const SavedRecipe = (props: Props) => {
  const [savedRecipe, setSavedRecipe] = useState(["This is recipe 1", "This is recipe 2", "This is recipe 3", "zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz"]);


  return (
    <Container
      sx={{ backgroundColor: 'white', paddingTop: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      <Grid container spacing={2} >
        {/* List of recipe books */}
        <Grid item xs={5} md={4}>

          {/* Title */}
          <Box sx={{
            borderBottom: 1,
            marginTop: 3,
            paddingBottom: 3,
          }}>
            <Typography variant="h4" align='center'>
              Saved Recipe Books
            </Typography>
          </Box>

          {/* List */}

          <Grid
            item
            direction="column"
            justifyContent="center"
            alignItems="center"
            pl={2}
            pr={2}
          >
            {savedRecipe.map((item, index) => (
              <Grid item container
                sx={{
                  marginTop: 2,
                  padding: 2,
                  backgroundColor: '#eeeeee',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                key={index}
                alignItems="center"
                direction="row"
              >
                <Grid item xs={9} md={10} justifyContent="flex-start">
                  <Typography>
                    {item}
                  </Typography>
                </Grid>

                <Grid item xs={3} md={2} pl={{ md:2}} justifyContent="flex-end">
                  <ClearIcon/>
                </Grid>
              </Grid>
            ))}
          </Grid>


          {/* Text input to create list */}



        </Grid>

        {/* List of recipe saved in the book */}
        <Grid item xs={7} md={8}>
          <Box sx={{
            borderBottom: 1,
            marginTop: 3,
            paddingBottom: 3,
          }}>
            <Typography variant="h4" align='center'>
              Recipe Folder
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SavedRecipe