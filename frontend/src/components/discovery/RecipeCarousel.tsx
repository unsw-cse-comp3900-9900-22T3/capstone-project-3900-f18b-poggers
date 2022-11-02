import { Divider, Typography } from '@mui/material'
import React from 'react'
import RecipeCard from './RecipeCard'
import Slider from "react-slick";
import DiscoveryCardLoader from './DiscoveryCardLoader'
import { RecipeThumbnail } from '../../types/instacook-types';

type Props = {
  heading: string,
  categoryTagId: string
}

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
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
        slidesToShow: 5,
        slidesToScroll: 5
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
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

const RecipeCarousel = (props: Props) => {
  const [recipes, setRecipes] = React.useState<RecipeThumbnail[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getRecipes = async () => {
      const body = {
        query: `
          query {
            getListRecipeByTags(tags: ["${props.categoryTagId}"]) {
              _id
              contributorUsername
              title
              content
              numberLike
              tags
            }
          }
        `
      }

      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const apiData = await res.json();

      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

      setRecipes([...apiData.data.getListRecipeByTags]);

      if (props.categoryTagId !== undefined) {
        // all api calls are done
        setLoading(false);
        console.log(recipes);
      }

    }
    getRecipes();
  }, [props.categoryTagId])


  return (
    <div style={carouselStyles}>
      <Typography variant="h5" style={{ paddingBottom: 4 }}>{props.heading}</Typography>
      <Slider {...sliderSettings}>
        {loading && placeholderArr.map((index) => (
          <DiscoveryCardLoader key={index} />
        ))}

        {recipes.map((data, index) => (
          !loading && <RecipeCard key={index} title={data.title} author={data.contributorUsername} img={JSON.parse(data.content)[3]} numberOfLikes={data.numberLike} recipeId={data._id} />
        ))}
      </Slider>
      <Divider />
    </div>
  )
}

export default RecipeCarousel