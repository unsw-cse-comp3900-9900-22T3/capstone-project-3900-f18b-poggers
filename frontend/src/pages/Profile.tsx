import React from 'react';
import { useState } from 'react';
import { Button, ButtonGroup, Checkbox, FormControlLabel, TextField, Typography, Container, Grid, Paper, Box } from '@mui/material';

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
              height: 150,
              weight: 150,
              maxHeight: 150,
              maxWidth: 150,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="Profile Image"
            src="https://i.redd.it/a1zcxisgjls71.png"
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
            Swxerson
          </Typography>

          <Typography variant="subtitle1" pr={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum, erat ac aliquam scelerisque, est enim luctus leo, a pretium diam nisl nec eros. Cras sit amet viverra eros.
          </Typography>
        </Grid>

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




    </Container>

  )
}

export default Profile