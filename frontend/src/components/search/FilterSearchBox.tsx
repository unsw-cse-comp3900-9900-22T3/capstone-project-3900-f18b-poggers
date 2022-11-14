import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { RecipeThumbnail, TagObj } from '../../types/instacook-types';

type Props = {
  // dropdown tag options
  options: TagObj,

  // list of recipes
  recipes: RecipeThumbnail[],

  // function to set recipe state
  setRecipes: React.Dispatch<React.SetStateAction<RecipeThumbnail[]>>,

  // function to set loading state
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const FilterSearchBox = (props: Props) => {
  // list of tag selections
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [newRecipes, setNewRecipes] = React.useState<RecipeThumbnail[]>([]);
  const [searchParams, setSearchParams] = useSearchParams({});

  React.useEffect(() => {
    /**
     * Takes search params and sets filters from them
     */
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
    const tagParams = searchParams.get('tags');
    if (tagParams === null) {
      console.log("Clearing");
      setSelectedValues([]);
      return;
    }

  }, [searchParams.get('tags')])

  React.useEffect(() => {
    /**
     * Renders placeholder cards
     */
    const renderLoadEffect = () => {
      props.setLoading(true);
    }

    /**
     * Updates search params with selected filter tags
     */
    const updateSearchParams = () => {
      searchParams.set("tags", selectedValues.toString());
      setSearchParams(searchParams);
    }

    /**
     * Gets and renders recipes given a search query
     */
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
    renderLoadEffect();
    getRecipes();
    updateSearchParams();
  }, [selectedValues])

  React.useEffect(() => {
    /**
     * Filters recipes based off selected tags
     */
    const filterRecipes = () => {
      if (selectedValues.length !== 0) {
        const filteredRecipes: RecipeThumbnail[] = newRecipes.filter((existingRecipe) => (
          // check if the list of existing tags is in the existing recipe's tags (subset)
          selectedValues.every(tag => existingRecipe.tags.includes((Object.keys(props.options).find(key => props.options[key] === tag)) || ''))
        ));

        props.setRecipes([...filteredRecipes]);
        props.setLoading(false);

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
      limitTags={8}
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