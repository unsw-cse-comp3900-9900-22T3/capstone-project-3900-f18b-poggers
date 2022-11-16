import React from 'react'
import { Button, Divider, Modal, IconButton, ListItemText, List, ListItem, Box, Grid, TextField, Typography } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { TagObj } from '../../types/instacook-types';

const filter = createFilterOptions<string>();

type Props = {
  // An array of strings containing the recipe's ingredients
  ingredients: string[],
  // An array of strings containing the recipe's cooking instructions
  instructions: string[],
  // An object containing all the tags as key, value pairs (TagName: TagId)
  tagOptions: TagObj,
  // An array of strings containing all the currently selected tags
  selectedValues: string[],
  // Handles the addition of instructions to the recipe
  handleInstruction: (event: React.FormEvent<HTMLFormElement>) => void,
  // Handles the addition of ingredients to the recipe
  handleIngredient: (event: React.FormEvent<HTMLFormElement>) => void,
  // Handles the removal of ingredients to the recipe
  handleRemoveIngredient: () => void,
  // Handles the addition of ingredients to the recipe
  handleRemoveInstruction: () => void,
  // Handles the creations of a user
  handleTagCreation: (tag: string) => void,
  // Handles the addition of a tag to the recipe
  handleTagAdd: (tags: string[]) => void,
}

const RecipeContents = (props: Props) => {

  const [ingredientText, setIngredientText] = React.useState<string>("");
  const [instructionText, setInstructionText] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState('');

  /**
   * Handles the addition of a new ingredient to the recipe and clears the test field
   *
   * @param e React event
   */
  const submitIngredient = (e: React.FormEvent<HTMLFormElement>) => {
    props.handleIngredient(e)
    setIngredientText('');
  }

  /**
   * Handles the addition of a new instruction to the recipe and clears the test field
   *
   * @param e React event
   */
  const submitInstruction = (e: React.FormEvent<HTMLFormElement>) => {
    props.handleInstruction(e)
    setInstructionText('');
  }
  return (
    <>
      <Grid container spacing={5} sx={{ padding: 3 }}>
        <Grid item sm={3}>
          <Typography variant="h5">
            Ingredients
          </Typography>
          <ul>
            {props.ingredients.map((ingredient, key) =>
              <li key={key}>
                <ListItemText primary={ingredient} />
              </li>
            )}
          </ul>
          <Box
            component="form"
            onSubmit={submitIngredient}
          >
            <TextField
              value={ingredientText}
              fullWidth
              variant='standard'
              onChange={(e) => { setIngredientText(e.target.value) }}
              InputProps={{
                endAdornment:
                  <>
                    <IconButton
                      color='secondary'
                      onClick={() => { props.handleRemoveIngredient() }}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      color='secondary'
                      type="submit">
                      <AddIcon />
                    </IconButton>
                  </>
              }}
              name="ingredient"
              id="ingredient"
              placeholder="Add another ingredient"
            />
          </Box>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="h5">
            Cooking Instructions
          </Typography>
          <List>
            {props.instructions.map((instruction, key) =>
              <ListItem key={key}>
                <Grid
                  container
                  spacing={0}
                  direction="row"
                >
                  <Grid item sm={0} sx={{ paddingTop: 0.75 }}>
                    <Typography variant="h5">
                      {key + 1}
                    </Typography>
                  </Grid>
                  <Grid item sm={10} sx={{ borderLeft: "1px solid", padding: 0, paddingLeft: 1, margin: 1 }}>
                    {instruction}
                  </Grid>
                </Grid>
              </ListItem>
            )}
          </List>
          <Box
            component="form"
            onSubmit={submitInstruction}
          >
            <TextField
              value={instructionText}
              fullWidth
              variant='standard'
              onChange={(e) => {
                setInstructionText(e.target.value)
              }}
              InputProps={{
                endAdornment:
                  <>
                    <IconButton
                      color='secondary'
                      onClick={() => { props.handleRemoveInstruction() }}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      color='secondary'
                      type="submit">
                      <AddIcon />
                    </IconButton>
                  </>
              }}
              name="instruction"
              id="instruction"
              placeholder="Add another cooking instruction"
            />
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ padding: 3 }}>
        <>
          <Autocomplete
            multiple
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              if (!Object.keys(props.tagOptions).includes(inputValue) && inputValue !== '') {
                filtered.push(`Create "${(params.inputValue)}" tag`);
              }

              return filtered;
            }}
            options={Object.values(props.tagOptions)}
            getOptionLabel={(option) => (Object.keys(props.tagOptions).find(key => props.tagOptions[key] === option)) || `${option}`}
            filterSelectedOptions
            limitTags={10}
            color="secondary"
            value={props.selectedValues}
            onChange={(_e, newValue) => {
              if (!Object.values(props.tagOptions).includes(newValue[newValue.length - 1]) && !Object.keys(props.tagOptions).includes(inputValue) && inputValue !== '') {
                props.handleTagCreation(inputValue);
              } else {
                props.handleTagAdd(newValue);
                console.log(newValue)
              }
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
        </>
      </Box>
    </>
  )
}

export default RecipeContents