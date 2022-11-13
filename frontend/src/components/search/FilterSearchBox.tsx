import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { RecipeThumbnail, TagObj } from '../../types/instacook-types';

type Props = {
  options: TagObj,
  recipes: RecipeThumbnail[],
  recipesCopy: RecipeThumbnail[],
  setRecipes: React.Dispatch<React.SetStateAction<RecipeThumbnail[]>>,
}

const FilterSearchBox = (props: Props) => {
  // list of tag selections
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [newRecipes, setNewRecipes] = React.useState<RecipeThumbnail[]>([]);
  const [searchParams, setSearchParams] = useSearchParams({});

  React.useEffect(() => {
    const setFiltersFromParams = () => {
      // load filters from tags
      if (searchParams.get('tags') !== null) {
        // an array of 1 string
        const tags: string[] = searchParams.getAll('tags')[0].split(',');
        if (tags[0].length !== 0) {
          setSelectedValues([...tags]);
        }
      }
    }
    setFiltersFromParams();
  }, [])

  React.useEffect(() => {
    // if tags and ingredients is null, then tags have been cleared
    // this is triggered when users re-enter the same search query
    if (searchParams.get('tags') === null) {
      console.log("Clearing");
      setSelectedValues([]);
    }
  }, [searchParams.get('tags')])

  React.useEffect(() => {
    const updateSearchParams = () => {
      searchParams.set("tags", selectedValues.toString());
      setSearchParams(searchParams);
    }

    const getRecipes = async () => {
      const body = {
        query: `
          query {
            getListRecipeByTitle(keywords:"${searchParams.get('query')}") {
              _id
              image
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
      console.log(apiData);
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

      setNewRecipes([...apiData.data.getListRecipeByTitle]);
    }

    getRecipes();
    updateSearchParams();
  }, [selectedValues])

  React.useEffect(() => {
    const filterRecipes = () => {
      if (selectedValues.length !== 0) {
        const filteredRecipes: RecipeThumbnail[] = newRecipes.filter((existingRecipe) => (
          // check if the list of existing tags is in the existing recipe's tags (subset)
          selectedValues.every(tag => existingRecipe.tags.includes((Object.keys(props.options).find(key => props.options[key] === tag)) || ''))
        ));

        props.setRecipes([...filteredRecipes]);
        return;
      }

    }
    filterRecipes();
  }, [newRecipes])

  return (
    <Autocomplete
      multiple
      options={Object.values(props.options)}
      getOptionLabel={(option) => (Object.keys(props.options).find(key => props.options[key] === option)) || ''}
      filterSelectedOptions
      limitTags={10}
      color="secondary"
      value={selectedValues}
      onChange={(_e, newValue) => {
        setSelectedValues([...newValue]);
      }}
      inputValue={inputValue}
      onInputChange={(_e, newInputValue) => {
        setInputValue(newInputValue);
      }}

      renderInput={(params) => (
        <TextField
          {...params}
          label={"Tags"}
          variant="outlined"
          color="secondary"
        />
      )}
    />

  )
}

export default FilterSearchBox