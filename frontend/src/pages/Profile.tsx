import React from 'react';
import { useState } from 'react';
import { Button, Typography, Container, Grid, Box } from '@mui/material';
import ProfileRecipe from '../components/ProfileRecipe';

type Props = {}

// const CheckboxExample = () => {
//   const [checked, setChecked] = useState(true)
//   return (
//     <FormControlLabel 
//       control={
//         <Checkbox 
//         checked={checked}
//         // onChange={(e)=>setChecked(!checked)}
//         onChange={(e)=>setChecked(e.target.checked)}
//         />
//       }
//       label="test"
//     />
//   )
// }

const Profile = (props: Props) => {
  return (
    <Container 
      maxWidth="md"
      >
      <Grid 
        container
        justifyContent="center"
        alignItems="center"
      >
        {/* Profile image */}
        <Grid item md={4}>
          <Box
            component="img"
            sx={{
              minHeight: 150,
              minWidth: 150,
              maxHeight: 150,
              maxWidth: 150,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="Profile Image"
            // src="https://i.redd.it/a1zcxisgjls71.png"
            // src="https://addapinch.com/wp-content/uploads/2017/07/old-fashioned-vanilla-ice-cream-recipe-DSC_4239.jpg"
            src="https://images.unsplash.com/photo-1615003162333-d3ff3ce1f0f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dWx0cmElMjB3aWRlfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
            mt={2}
            ml={{md: 6}}
          />

          {/* Subscribe button */}
          <Box 
            textAlign='center'
            mr={{md: 4}}
            mt={1}
          >
            <Button
              onClick={() => alert('subscribe')}
              variant="contained"
              color="secondary"
              size="small"
            >
              Subscribe
            </Button>
          </Box>

        </Grid>

        {/* Username and description */}
        <Grid item xs={12} md={8}> 
          <Typography variant="h3">
            John Xina
          </Typography>

          <Typography variant="subtitle1" pr={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum, erat ac aliquam scelerisque, est enim luctus leo, a pretium diam nisl nec eros. Cras sit amet viverra eros.
          </Typography>
        </Grid>

        {/* Recipe header */}
        <Grid item md={12} xs={12}>
            <Box sx={{
              borderBottom: 1,
              marginTop: 3,
            }}>
              <Typography variant="h5" ml={2}>
                Recipes
              </Typography>
            </Box>
        </Grid>

      </Grid>  

      {/* Recipe Posts */}
      <Grid 
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        md={9}
        ml={{md: 15}}
        mr={{md: 15}}
      >
        <ProfileRecipe />
        <ProfileRecipe />
        <ProfileRecipe />
        <ProfileRecipe />
        <ProfileRecipe />
      </Grid>




    </Container>

  )
}

export default Profile