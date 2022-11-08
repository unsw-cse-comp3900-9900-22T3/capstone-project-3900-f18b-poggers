import React from 'react'
import RecipeCarousel from '../components/discovery/RecipeCarousel'
import { Tag, TagObj } from '../types/instacook-types'

type Props = {}

const Discovery = (props: Props) => {
  const [tagIds, setTagIds] = React.useState<TagObj>({});

  React.useEffect(() => {
    const loadTags = async () => {
      const body = {
        query: `
          query {
            getTags {
              _id
              content
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

      // create custom tag object
      const tagArr: Tag[] = apiData.data.getTags;
      const tags: TagObj = {}

      tagArr.map((tag: Tag) => {
        return tags[tag.content] = tag._id;
      })
      setTagIds(tags);
    }
    loadTags();
  }, [])

  return (
    <>
      <RecipeCarousel heading={"Most Popular Beef Recipes"} categoryTagId={tagIds['Beef']} />
      <RecipeCarousel heading={"Most Popular Chicken Recipes"} categoryTagId={tagIds['Chicken']} />
      <RecipeCarousel heading={"Most Popular Dessert Recipes"} categoryTagId={tagIds['Dessert']} />
    </>
  )
}

export default Discovery