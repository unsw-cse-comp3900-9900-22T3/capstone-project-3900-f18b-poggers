import { Button, Typography, Container, Grid, Box } from '@mui/material';
import ProfileRecipe from '../components/ProfileRecipe';

type Props = {}

// Sample data for props

type RecipePost = {
  name: string,
  description: string,
  tag: string[],
  src: string,
  like: number,
}

const post1: RecipePost = {
  name: "Bing Chilling",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum, erat ac aliquam scelerisque, est enim luctus leo, a pretium diam nisl nec eros. Cras sit amet viverra eros.",
  tag: ['vanilla'],
  src: "https://cdn.discordapp.com/attachments/206003287093149696/1026867082610085898/unknown.png",
  like: 9999,
}

const post2: RecipePost = {
  name: "Tap Water",
  description: "Short Description",
  tag: ['h20','water','glass','coke'],
  src: "https://media.discordapp.net/attachments/206003287093149696/1026867303154978906/unknown.png?width=1080&height=60",
  like: 6969,
}

const post3: RecipePost = {
  name: "Happy Meal",
  description: "im lovin it",
  tag: ['kfc','is','better'],
  src: "https://www.kiis1011.com.au/wp-content/uploads/sites/3/2020/10/mymaccas-happymeal.png?crop=84px,0px,899px,1080px&resize=680,816&quality=75",
  like: 420,
}

const post4: RecipePost = {
  name: "Holidays",
  description: "cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains",
  tag: ['instagram','instagram','instagram','instagram','instagram','instagram'],
  src: "https://images.unsplash.com/photo-1615003162333-d3ff3ce1f0f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dWx0cmElMjB3aWRlfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
  like: 21,
}

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
          <Typography variant="h3" mb={1}>
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
              paddingBottom: 1,
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
        <ProfileRecipe post={post1}/>
        <ProfileRecipe post={post2}/>
        <ProfileRecipe post={post3}/>
        <ProfileRecipe post={post4}/>
      </Grid>
    </Container>
  )
}

export default Profile