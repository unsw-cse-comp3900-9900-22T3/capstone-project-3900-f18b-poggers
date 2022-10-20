import React from 'react'
import RecipeCard from '../components/discovery/RecipeCard'
import RecipeCarousel from '../components/discovery/RecipeCarousel'

type Props = {}

const Discovery = (props: Props) => {
  return (
    <>
      <RecipeCarousel heading={"Beef Recipes"} />
      <RecipeCarousel heading={"Beef Recipes"} />
      <RecipeCarousel heading={"Beef Recipes"} />
    </>
  )
}

export default Discovery