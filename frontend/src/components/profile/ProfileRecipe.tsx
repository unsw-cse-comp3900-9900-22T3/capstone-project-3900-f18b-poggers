import { Typography, Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Recipe } from '../../types/instacook-types';
import { Image } from 'mui-image'
import FavoriteIcon from '@mui/icons-material/Favorite';

type Props = {
  post: Recipe,
}

const ProfileRecipe = (props: Props) => {

  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getDescription = async () => {
      try {
        // if description array doesn't exist, display ingredients
        const desc = JSON.parse(props.post.content);
        desc[2] === undefined ? setDescription(desc[0]) : setDescription(desc[2]);
      } catch (e) {
        // if its not parsable at all, display as it is
        setDescription(props.post.content);
      }
    }
    // getImageUrl();
    getDescription();

  }, [props.post.content])

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
      justifyContent={{ xs: 'center', md: 'left' }}
      alignItems="center"
      sx={{
        borderRadius: '15px',
        marginTop: 2,
        padding: 0,
        backgroundColor: '#eeeeee',
        boxShadow: '0px 2px 0px 0px rgba(210,210,210,1)'
      }}
    >

      {/* Recipe thumbnail */}
      <Grid item md={4} mr={2} ml={{ md: 0, xs: 1.5 }} onClick={() => navigate(`/recipe/${props.post._id}`)}>
        <Image
          style={{
            minHeight: 200,
            maxHeight: 200,
            padding: 0,
            objectFit: "cover",
            borderRadius: '15px',
            cursor: 'pointer'
          }}
          duration={0}
          alt="Recipe Thumbnail"
          src={props.post.image}
        />

      </Grid>

      {/* Recipe title and description */}
      <Grid item md={7} xs={12} pl={2} pr={2}>
        <Grid item>
          <Typography 
            noWrap variant="h4" 
            ml={0.25}
            mt={{xs: 1, md: 0}}
          >
            {props.post.title}
          </Typography>

          <Typography 
            pl={0.5}
            variant="caption" 
            sx={{ cursor: "pointer" }}
            onClick={() => location.pathname === '/feed' && navigate(`/profile/${props.post.contributorUsername}`)}
          >
            Posted by {props.post.contributorUsername}
          </Typography> 
            

          <Typography sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
          }}
            pl={0.5}
            mb={0.5}>
            {description}
          </Typography>
        </Grid>

        {/* Tags and likes */}
        <Grid
          container
          direction="row"
          alignItems="flex-end"
          mb={{xs: 2, md: 0}}
        >

          <Box sx={tagStyles}>
            <Grid container direction="row" alignItems="center">
              <FavoriteIcon sx={{ fontSize: "16px", marginRight: 0.5}}/> 
              <Typography>
                {props.post.numberLike}
              </Typography>
            </Grid>
          </Box>

          {
            props.post.tags.map((item, index) => {
              return (
                <Box key={index} sx={tagStyles}>
                  <Typography>
                    {item}
                  </Typography>
                </Box>
              )
            })
          }
        </Grid>
      </Grid>
    </Grid>


  )
}

export default ProfileRecipe