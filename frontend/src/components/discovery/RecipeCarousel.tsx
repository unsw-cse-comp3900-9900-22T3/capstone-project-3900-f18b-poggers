import { Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import RecipeCard from './RecipeCard'
import testimg from '../../static/images/authbackground.jpeg'
import testimg2 from '../../static/images/logo.jpeg'
import Slider from "react-slick";
import DiscoveryCardLoader from './DiscoveryCardLoader'

type Props = {
  heading: string
}

type DiscoveryRecipe = {
  title: string,
  author: string,
  img: string
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

const testData: DiscoveryRecipe[] = [
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg2
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg2
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg2
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg2
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg2
  },
  {
    title: "Beef Wellington",
    author: "gordonramsay",
    img: testimg2
  },
]

const RecipeCarousel = (props: Props) => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getRecipes = async () => {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(json => {
          setTimeout(() => setLoading(false), 4000);
        });
    }
    getRecipes();
  }, [])
  return (
    <div style={carouselStyles}>
      <Typography variant="h5" style={{ paddingBottom: 4 }}>{props.heading}</Typography>
      <Slider {...sliderSettings}>
        {testData.map((data) => (
          loading ? <DiscoveryCardLoader /> : <RecipeCard title={data.title} author={data.author} img={data.img} />
        ))}
      </Slider>
      <Divider />
    </div>
  )
}

export default RecipeCarousel