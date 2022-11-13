import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

type Props = {
  title: string,
  author: string,
  authorImg?: string,
  img: string,
  recipeId: string,
  numberOfLikes: number
}

const RecipeCard = (props: Props) => {

  const navigate = useNavigate();
  return (
    <Card sx={{ maxWidth: 290, backgroundColor: '#eeeeee', marginLeft: 0.5, marginRight: 0.5 }}>
      <CardHeader
        avatar={
          <Avatar
            onClick={() => { navigate('/profile/' + props.author) }}
            sx={{ bgcolor: red[500], cursor: 'pointer' }}
            aria-label="recipe"
          >
            {props.author.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={<Typography noWrap>{props.title}</Typography>}
        subheader={"by " + props.author}

      />
      <CardMedia
        component="img"
        height="194"
        image={props.img}
        alt="Recipe Image"
        sx={{ cursor: 'pointer' }}
        onClick={() => { navigate('/recipe/' + props.recipeId) }}
      />
      <CardActions disableSpacing>
        <FavoriteIcon aria-label="likes" style={{ color: '#ed415b', marginRight: 2 }} />
        <Typography>
          {props.numberOfLikes}
        </Typography>
      </CardActions>
    </Card>
  );
}

export default RecipeCard