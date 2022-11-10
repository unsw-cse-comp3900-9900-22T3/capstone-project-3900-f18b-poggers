import {Typography,Grid, Box} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';

type Props = {
  id: string,
  name: string,
  contributor: string,
  like: number,
  removeSavedRecipe: (id: string) => void,
}

const RecipeFolder = (props: Props) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ borderBottom: 1, paddingBottom: 1, borderColor: "#4F4F4F"}}> 
      <Grid item container
        sx={{
          marginTop: 1,
          padding: 2,
          borderRadius: '5px',
          cursor: 'pointer',
          "&:hover": {
            backgroundColor: '#EDFAFC'
          }
        }}
    
        alignItems="center"
        direction="row"
      >

        {/* Recipe name */}
        <Grid 
          item
          container 
          direction="row" 
          alignItems="center"  
          xs={8} md={4} mr={4}
          justifyContent="flex-start"
          onClick={() => navigate(`/recipe/${props.id}`)}
        >
          <Grid item md={2}>
            <MenuBookIcon sx={{ fontSize: "25px"}}/>
          </Grid>
          <Grid item md={8}>
            <Typography sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '3',
              WebkitBoxOrient: 'vertical',
            }}>
              {props.name}
            </Typography>
          </Grid>
        </Grid>

        {/* Contributor  */}
        <Grid 
          item 
          container 
          direction="row" 
          alignItems="center" 
          xs={8} md={3} mr={1} 
          justifyContent="flex-start" 
          onClick={() => navigate(`/profile/${props.contributor}`)}
        >
          <PersonIcon sx={{ fontSize: "25px", marginRight: 0.5}}/>
          <Typography>
            {props.contributor}
          </Typography>
        </Grid>

        {/* Likes */}
        <Grid 
          item 
          container 
          direction="row" 
          alignItems="center" 
          xs={8} md={2} mr={1} 
          justifyContent="flex-start"
        >
          <FavoriteIcon sx={{ fontSize: "16px", marginRight: 0.5}}/> 
          <Typography>
            {props.like}
          </Typography>
        </Grid>

        {/* Clear button */}
        <Grid item xs={2} md={2} pl={{md:12}} justifyContent="flex-end">
          <ClearIcon onClick={() => props.removeSavedRecipe(props.id)} style={{ color: 'red' }}/>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RecipeFolder