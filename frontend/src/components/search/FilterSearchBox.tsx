import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'


type Props = {
  buttonText: string,
  filterType: "tags" | "ingredients"
}

const FilterSearchBox = (props: Props) => {
  // list of tag selections
  const [value, setValue] = React.useState<string[]>([]);

  const [inputValue, setInputValue] = React.useState('');
  const [searchParams, setSearchParams] = useSearchParams({});

  React.useEffect(() => {
    const setFiltersFromParams = () => {
      // load filters from tags
      if (props.filterType === 'tags' && searchParams.get('tags') !== null) {
        // an array of 1 string
        const tags: string[] = searchParams.getAll('tags')[0].split(',');
        if (tags[0].length !== 0) {
          setValue([...tags]);
          console.log("New tag value: ", value, "| from: ", tags);
        }
        return;
      }

      // load filters from ingredients
      if (props.filterType === 'ingredients' && searchParams.get('ingredients') !== null) {
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
      if (props.filterType === 'tags') {
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
      options={top100Films}
      filterSelectedOptions
      limitTags={2}
      color="secondary"
      value={value}
      onChange={(_e, newValue) => {
        setValue([...newValue]);
        console.log('Setting new value: ', value)
      }}
      onLoad={() => {

        if (props.filterType === 'tags' && searchParams.get('tags') !== null) {
          // setValue([...searchParams.getAll('tags')]);
          // console.log("New tag value: ", value, "| from: ", searchParams.getAll('tags').split(','));
          // an array of 1 string
          const tags = searchParams.getAll('tags')[0].split(',');
          if (tags[0].length !== 0) {
            setValue([...tags]);
            setValue(["12 Angry Men"]);
            console.log("New tag value: ", value, "| from: ", tags);
          }
          return;
        }
      }}
      inputValue={inputValue}
      onInputChange={(_e, newInputValue) => {
        setInputValue(newInputValue);
      }}

      renderInput={(params) => (
        <TextField
          {...params}
          label={props.buttonText}
          variant="outlined"
          color="secondary"
        />
      )}
    />

  )
}

export default FilterSearchBox

const top100Films = [
  'The Shawshank Redemption',
  'The Godfather',
  'The Godfather: Part II',
  'The Dark Knight',
  '12 Angry Men',
  "Schindler's List",
  'Pulp Fiction',
  'The Lord of the Rings: The Return of the King',
  'The Good, the Bad and the Ugly',
  'Fight Club',
  'The Lord of the Rings: The Fellowship of the Ring',
  'Star Wars: Episode V - The Empire Strikes Back',
  'Forrest Gump',
  'Inception',
  'The Lord of the Rings: The Two Towers',
  "One Flew Over the Cuckoo's Nest",
  'Goodfellas',
  'The Matrix',
  'Seven Samurai',
  'Star Wars: Episode IV - A New Hope',
  'City of God',
  'Se7en',
  'The Silence of the Lambs',
  "It's a Wonderful Life",
  'Life Is Beautiful',
  'The Usual Suspects',
  'Léon: The Professional',
  'Spirited Away',
  'Saving Private Ryan',
  'Once Upon a Time in the West',
  'American History X',
  'Interstellar',
  'Casablanca',
  'City Lights',
  'Psycho',
  'The Green Mile',
  'The Intouchables',
  'Modern Times',
  'Raiders of the Lost Ark',
  'Rear Window',
  'The Pianist',
  'The Departed',
  'Terminator 2: Judgment Day',
  'Back to the Future',
  'Whiplash',
  'Gladiator',
  'Memento',
  'The Prestige',
  'The Lion King',
  'Apocalypse Now',
  'Alien',
  'Sunset Boulevard',
  'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
  'The Great Dictator',
  'Cinema Paradiso',
  'The Lives of Others',
  'Grave of the Fireflies',
  'Paths of Glory',
  'Django Unchained',
  'The Shining',
  'WALL·E',
  'American Beauty',
  'The Dark Knight Rises',
  'Princess Mononoke',
  'Aliens',
  'Oldboy',
  'Once Upon a Time in America',
  'Witness for the Prosecution',
  'Das Boot',
  'Citizen Kane',
  'North by Northwest',
  'Vertigo',
  'Star Wars: Episode VI - Return of the Jedi',
  'Reservoir Dogs',
  'Braveheart',
  'M',
  'Requiem for a Dream',
  'Amélie',
  'A Clockwork Orange',
  'Like Stars on Earth',
  'Taxi Driver',
  'Lawrence of Arabia',
  'Double Indemnity',
  'Eternal Sunshine of the Spotless Mind',
  'Amadeus',
  'To Kill a Mockingbird',
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
  'Monty Python and the Holy Grail',
];
