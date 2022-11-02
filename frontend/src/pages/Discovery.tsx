import React from 'react'
import RecipeCarousel from '../components/discovery/RecipeCarousel'
import { Tag } from '../types/instacook-types'

type Props = {}

type TagObj = {
  [tagName: string]: string
}

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

      const tagArr: Tag[] = apiData.data.getTags;
      const tags: TagObj = {}

      // create custom tag object
      tagArr.map((tag: Tag) => {
        return tags[tag.content] = tag._id;
      })
      setTagIds(tags);
    }
    loadTags();
  }, [])

  return (
    <>
      <RecipeCarousel heading={"Beef Recipes"} categoryTagId={tagIds['Beef']} />
      <RecipeCarousel heading={"Lunch Recipes"} categoryTagId={tagIds['Chicken']} />
      <RecipeCarousel heading={"Dinner Recipes"} categoryTagId={tagIds['Dessert']} />
    </>
  )
}

export default Discovery