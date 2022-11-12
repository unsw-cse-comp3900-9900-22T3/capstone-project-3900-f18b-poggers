import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter } from '../../types/instacook-enums';

type Props = {
  filterType: Filter.Tags | Filter.Ingredients,
  options: string[];
}

const FilterSearchBox = (props: Props) => {
  // list of tag selections
  const [value, setValue] = React.useState<string[]>([]);

  const [inputValue, setInputValue] = React.useState('');
  const [searchParams, setSearchParams] = useSearchParams({});

  React.useEffect(() => {
    const setFiltersFromParams = () => {
      // load filters from tags
      if (props.filterType === Filter.Tags && searchParams.get('tags') !== null) {
        // an array of 1 string
        const tags: string[] = searchParams.getAll('tags')[0].split(',');
        if (tags[0].length !== 0) {
          setValue([...tags]);
          console.log("New tag value: ", value, "| from: ", tags);
        }
        return;
      }

      // load filters from ingredients
      if (props.filterType === Filter.Ingredients && searchParams.get('ingredients') !== null) {
        const ingredients: string[] = searchParams.getAll('ingredients')[0].split(',');
        if (ingredients[0].length !== 0) {
          setValue([...ingredients]);
          console.log("New tag value: ", value, "| from: ", ingredients);
        }
      }
    }
    setFiltersFromParams();
  }, [])

  React.useEffect(() => {
    // if tags and ingredients is null, then tags have been cleared
    // this is triggered when users re-enter the same search query
    if (searchParams.get('tags') === null && searchParams.get('ingredients') === null) {
      console.log("Clearing");
      setValue([]);
    }
  }, [searchParams.get('tags'), searchParams.get('ingredients')])

  React.useEffect(() => {
    const updateSearchParams = () => {
      console.log("Saving to params: ", value);
      if (props.filterType === Filter.Tags) {
        // tag filter
        searchParams.set("tags", value.toString());
      } else {
        // ingredient filter
        searchParams.set("ingredients", value.toString());
      }

      setSearchParams(searchParams);
    }
    updateSearchParams();
  }, [value])

  return (
    <Autocomplete
      multiple
      options={props.options}
      filterSelectedOptions
      limitTags={2}
      color="secondary"
      value={value}
      onChange={(_e, newValue) => {
        setValue([...newValue]);
        console.log('Setting new value: ', value)
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