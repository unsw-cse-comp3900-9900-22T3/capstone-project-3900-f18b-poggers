import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter } from '../../types/instacook-enums';
import { RecipeThumbnail, Tag, TagObj } from '../../types/instacook-types';

type Props = {
  filterType: Filter.Tags | Filter.Ingredients,
  options: TagObj,
  recipes: RecipeThumbnail[],
  setRecipes: React.Dispatch<React.SetStateAction<RecipeThumbnail[]>>,
  // loadRecipes: () => void,
}

const FilterSearchBox = (props: Props) => {
  // list of tag selections
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [searchParams, setSearchParams] = useSearchParams({});
  React.useEffect(() => {
    const setFiltersFromParams = () => {
      // load filters from tags
      if (props.filterType === Filter.Tags && searchParams.get('tags') !== null) {
        // an array of 1 string
        const tags: string[] = searchParams.getAll('tags')[0].split(',');
        if (tags[0].length !== 0) {
          setSelectedValues([...tags]);
          console.log("New tag value: ", selectedValues, "| from: ", tags);
        }
        return;
      }

      // load filters from ingredients
      if (props.filterType === Filter.Ingredients && searchParams.get('ingredients') !== null) {
        const ingredients: string[] = searchParams.getAll('ingredients')[0].split(',');
        if (ingredients[0].length !== 0) {
          setSelectedValues([...ingredients]);
          console.log("New tag value: ", selectedValues, "| from: ", ingredients);
        }
      }
    }
    // setOptionLabels();
    setFiltersFromParams();
  }, [])

  React.useEffect(() => {
    // if tags and ingredients is null, then tags have been cleared
    // this is triggered when users re-enter the same search query
    if (searchParams.get('tags') === null && searchParams.get('ingredients') === null) {
      console.log("Clearing");
      setSelectedValues([]);
    }
  }, [searchParams.get('tags'), searchParams.get('ingredients')])

  React.useEffect(() => {
    const updateSearchParams = () => {
      console.log("Saving to params: ", selectedValues);
      if (props.filterType === Filter.Tags) {
        // tag filter
        searchParams.set("tags", selectedValues.toString());
      } else {
        // ingredient filter
        searchParams.set("ingredients", selectedValues.toString());
      }

      setSearchParams(searchParams);
    }

    const getRecipes = async () => {
      if (selectedValues.length === 0) {
        return;
      }
      const body = {
        query: `
          query {
            getListRecipeByTags(tags: [${selectedValues.map((val) => ('\"' + val + '\"'))}]) {
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

      console.log(apiData.data)
      props.setRecipes([...apiData.data.getListRecipeByTags]);
    }

    const filterRecipes = () => {
      if (selectedValues.length !== 0) {
        getRecipes();
        const newRecipes: RecipeThumbnail[] = props.recipes.filter((existingRecipe) => (
          // check if the list of existing tags is in the existing recipe's tags (subset)
          selectedValues.every(tag => existingRecipe.tags.includes((Object.keys(props.options).find(key => props.options[key] === tag)) || ''))
        ))
        props.setRecipes([...newRecipes]);
        return;
      }
      getRecipes();

    }
    updateSearchParams();
    filterRecipes();
  }, [selectedValues])

  return (
    <Autocomplete
      multiple
      options={Object.values(props.options)}
      getOptionLabel={(option) => (Object.keys(props.options).find(key => props.options[key] === option)) || ''}
      filterSelectedOptions
      limitTags={2}
      color="secondary"
      value={selectedValues}
      onChange={(_e, newValue) => {
        setSelectedValues([...newValue]);
        console.log('Setting new value: ', selectedValues)
      }}
      inputValue={inputValue}
      onInputChange={(_e, newInputValue) => {
        setInputValue(newInputValue);
      }}

      renderInput={(params) => (
        <TextField
          {...params}
          label={props.filterType}
          variant="outlined"
          color="secondary"
        />
      )}
    />

  )
}

export default FilterSearchBox