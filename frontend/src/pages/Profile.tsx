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
      maxWidth="sm"
      >
      <Grid 
        container
        // direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={4}>
          <Box
            component="img"
            sx={{
              height: 150,
              weight: 150,
              maxHeight: {xs: 125, md: 150},
              maxWidth: {xs: 125, md: 150},
              borderRadius: "50%",
              objectFit: "cover"
            }}
            alt="Profile Image"
            src="https://i.redd.it/a1zcxisgjls71.png"
          />
        </Grid>

        <Grid item xs={8}> 
          <Typography variant="h3">
            Swxerson
          </Typography>

          <Typography variant="subtitle1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum, erat ac aliquam scelerisque, est enim luctus leo, a pretium diam nisl nec eros. Cras sit amet viverra eros.
          </Typography>
        </Grid>
      </Grid>  



        <Button
          onClick={() => alert('subscribe')}
          variant="contained"
          color="secondary"
          size="small">
          Subscribe
        </Button>
    </Container>

  )
}

export default Profile