import React from 'react'
import RecipeCard from '../components/discovery/RecipeCard'
import testimg from '../static/images/authbackground.jpeg'

type Props = {}

const Discovery = (props: Props) => {
  return (
    <RecipeCard title="Beef Wellington" author='gordonramsay' img={testimg} />
  )
}

export default Discovery