import { Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import RecipeCard from './RecipeCard'
import testimg from '../../static/images/authbackground.jpeg'
import testimg2 from '../../static/images/logo.jpeg'
import Slider from "react-slick";

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
  // responsive: [
  //   {
  //     breakpoint: 1024,
  //     settings: {
  //       arrows: false,
  //     },
  //   },
  // ],
};


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

  return (
    <div style={{ backgroundColor: 'gray', padding: 48, paddingTop: 32, paddingBottom: 32 }}>
      <Typography variant="h5" style={{ paddingBottom: 4 }}>{props.heading}</Typography>
      <Slider {...sliderSettings}>
        {testData.map((data) => (
          < RecipeCard title={data.title} author={data.author} img={data.img} />
        ))}
      </Slider>
      <Divider />
    </div>
  )
}

export default RecipeCarousel