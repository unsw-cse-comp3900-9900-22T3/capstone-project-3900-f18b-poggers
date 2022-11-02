import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import testimg from '../../static/images/authbackground.jpeg'
import testavatar from '../../static/images/logo.jpeg'
import { useNavigate } from 'react-router-dom';

type Props = {
  title: string,
  author: string,
  authorImg?: string,
  img: string,
  recipeId?: string // temporarily optional
}

const RecipeCard = (props: Props) => {

  const navigate = useNavigate();
  return (
    <Card sx={{ maxWidth: 290, backgroundColor: '#eeeeee', marginLeft: 0.5, marginRight: 0.5 }}>
      <CardHeader
        avatar={
          <Avatar
            onClick={() => { navigate('/profile/' + props.author) }}
            src={props.authorImg && testavatar}
            sx={{ bgcolor: red[500], cursor: 'pointer' }}
            aria-label="recipe">

          </Avatar>
        }
        title={props.title}
        subheader={"by " + props.author}
      />
      <CardMedia
        component="img"
        height="194"
        image={testimg && props.img}
        alt="Recipe Image"
        sx={{ cursor: 'pointer' }}
        // onClick={() => { navigate('/recipe/' + props.recipeId) }}
        onClick={() => { navigate('/recipe/98ce17ef-7047-422b-981b-c25d93046510') }}
      />
      <CardActions disableSpacing>
        <FavoriteIcon aria-label="likes" style={{ color: '#ed415b', marginRight: 2 }} />
        <Typography>
          6000
        </Typography>
      </CardActions>
    </Card>
  );
}

export default RecipeCard