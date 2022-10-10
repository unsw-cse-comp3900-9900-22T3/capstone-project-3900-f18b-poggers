import { Typography, Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Storage } from "aws-amplify";
import { useNavigate } from "react-router-dom";

// type RecipeObject = {
//   id: string,
//   name: string,
//   content: string,
//   fileImage: string,
//   like: number,
//   tag: string[],
// }

type Recipe = {
  id: string,
  name: string,
  content: string,
  contributor: string,
  fileImage: string,
  createdAt: string,
  updatedAt: string,
  owner: string,
}

type Props = {
  post: Recipe,
}

const ProfileRecipe = (props: Props) => {

  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getImageUrl = async () => {
      const fileAccessURL = await Storage.get(props.post.fileImage, { expires: 30 ,level: "public"});
      setImageURL(fileAccessURL);
    };
    getImageUrl();
  },[props.post.fileImage]) 

  // const tagStyles = {
  //   backgroundColor: '#28343c',
  //   padding: 1,
  //   borderRadius: 2,
  //   color: '#FFF',
  //   margin: 0.5,
  // }

  return (
    <Grid 
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        border: 1,
        borderRadius: '15px',
        marginTop: 2,
        padding: 0.75,
      }}
    >

      {/* Recipe thumbnail */}
      <Grid item md={4} mr={2} ml={{md: -4, xs:1.5}}>
        <Box
          component="img"
          sx={{
            minHeight: 200,
            minWeight: 200,
            maxHeight: 200,
            maxWidth: 200,
            objectFit: "cover",
            borderRadius: '10px',
          }}
          onClick={() => navigate(`/recipe/${props.post.id}`)}
          alt="Recipe Thumbnail"
          src={imageURL}
        />

      </Grid>

      {/* Recipe title and description */}
      <Grid item md={7} xs={12}>
        <Grid item>
          <Typography noWrap variant="h4" mb={1} ml={0.25}>
            {props.post.name}
          </Typography>

          <Typography sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
          }} 
          variant="body2" 
          pl={0.5} 
          mb={1}>
            {props.post.content}
          </Typography>
        </Grid>

        {/* Tags and likes */}
        {/* <Grid
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
        </Grid> */}
      </Grid>
    </Grid>


  )
}

export default ProfileRecipe