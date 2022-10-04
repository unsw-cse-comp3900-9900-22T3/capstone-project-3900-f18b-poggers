import {Typography, Grid, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';


type RecipePost = {
  name: string,
  description: string,
  tag: string[],
  src: string,
  like: number,
}

type Props = {
  post: RecipePost
}

const ProfileRecipe = (props: Props) => {

  const tagStyles = {
    backgroundColor: '#28343c',
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
            padding: 1,
          }}
        >

          {/* Recipe thumbnail */}
          <Grid item md={4} mr={2}>
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
              src={props.post.src}
            />

          </Grid>

          {/* Recipe title and description */}
          <Grid item md={6}>
            <Grid item>
              <Typography variant="h3" mb={1}>
                {props.post.name}
              </Typography>

              <Typography variant="body2" pl={0.5} mb={1}>
                {props.post.description}
              </Typography>
            </Grid>

            {/* Tags and likes */}
            <Grid
              container
              direction="row"
              alignItems="flex-end"
            >
              { 
                props.post.tag.map((item, index) => {
                  return (
                    <Box sx={tagStyles}>
                      {item}
                    </Box>
                  )
                })
              }

              <Box sx={tagStyles}>
                <Grid container direction="row" alignItems="center">
                  <FavoriteIcon fontSize='small'/> {props.post.like}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
    

  )
}

export default ProfileRecipe