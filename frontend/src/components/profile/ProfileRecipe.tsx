import { Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Storage } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { Recipe } from '../../types/instacook-types';
import { Image } from 'mui-image'

type Props = {
  post: Recipe,
}

const ProfileRecipe = (props: Props) => {

  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

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

    const getImageUrl = async () => {
      const fileAccessURL = await Storage.get(props.post.fileImage, { expires: 30, level: "public" });
      setImageURL(fileAccessURL);
    };

    getImageUrl();
    getDescription();

  }, [props.post.fileImage, props.post.content])

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
      justifyContent={{ xs: 'center', md: 'left' }}
      alignItems="center"
      sx={{
        border: 1,
        borderRadius: '15px',
        marginTop: 2,
        padding: 0
      }}
    >

      {/* Recipe thumbnail */}
      <Grid item md={4} mr={2} ml={{ md: 0, xs: 1.5 }} onClick={() => navigate(`/recipe/${props.post.id}`)}>
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
            {description}
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