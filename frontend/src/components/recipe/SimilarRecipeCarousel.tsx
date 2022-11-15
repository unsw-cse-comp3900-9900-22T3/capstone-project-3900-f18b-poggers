import React from 'react'

import { Typography } from '@mui/material'
import RecipeCard from '../RecipeCard'
import Slider from "react-slick";
import DiscoveryCardLoader from '../RecipeCardPlaceholder'
import { RecipeThumbnail } from '../../types/instacook-types';

type Props = {
  // title of the carousel
  heading: string,

  // id of the recipe
  recipeId: string,
}

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  vertical: false,

  // mui default breakpoints
  // xs, extra-small: 0px
  // sm, small: 600px
  // md, medium: 900px
  // lg, large: 1200px
  // xl, extra-large: 1536px
  responsive: [
    {
      breakpoint: 1536,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      },
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      },
    },
  ],
};

const carouselStyles = {
  backgroundColor: 'white',
  padding: 48,
  paddingTop: 32,
  paddingBottom: 32,
  borderBottom: '1px solid #eeeeee'
}

const placeholderArr = [0, 1, 2, 3, 4, 5];

const SimilarRecipeCarousel = (props: Props) => {
  const [recipes, setRecipes] = React.useState<RecipeThumbnail[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getRecipes = async () => {
      try {
        const body = {
          query: `
            query {
              getListReccommendRecipe(recipeID: ${props.recipeId}) {
                _id
                contributorUsername
                title
                content
                numberLike
                tags
                image
              }
            }
          `
        }

        const res = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(body),
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const apiData = await res.json();

        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }

        setRecipes([...apiData.data.getListReccommendRecipe]);

        if (props.recipeId !== undefined) {
          // all api calls are done
          setLoading(false);
        }
      } catch (error) {
        console.log("get recommended list failed", error);
      }

    }
    getRecipes();
  }, [props.recipeId])


  return (
    <div style={carouselStyles}>
      <Typography variant="h5" style={{ paddingBottom: 4 }}>{props.heading}</Typography>
      <Slider {...sliderSettings}>
        {loading && placeholderArr.map((index) => (
          <DiscoveryCardLoader key={index} />
        ))}

        {recipes.map((recipe, idx) => (
          !loading && <RecipeCard key={idx} title={recipe.title} author={recipe.contributorUsername} img={recipe.image} numberOfLikes={recipe.numberLike} recipeId={recipe._id} />
        ))}
      </Slider>
    </div>
  )
}

export default SimilarRecipeCarousel