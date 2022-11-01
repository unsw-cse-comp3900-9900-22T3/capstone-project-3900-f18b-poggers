import React from 'react'
import { IconButton, ListItemText, List, ListItem, Box, Grid, TextField, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
// type Props = {
//   handleMenuClose: () => void,
//   username: string,
//   anchorEl: HTMLElement | null,
// }

type Props = {
  ingredients : string[],
  instructions : string[],
  tags: string[],
  // instructionText : string,
  // ingredientText: string,
  handleInstruction: (event: React.FormEvent<HTMLFormElement>) => void,
  handleIngredient: (event: React.FormEvent<HTMLFormElement>) => void,
  handleRemoveIngredient: () => void,
  handleRemoveInstruction: () => void,
}

const RecipeContents = (props: Props) => {

  const [ingredientText, setIngredientText] = React.useState<string>("");
  const [instructionText, setInstructionText] = React.useState<string>("");

  const submitIngredient = (e: React.FormEvent<HTMLFormElement>) => {
    props.handleIngredient(e)
    setIngredientText('');
  }

  const submitInstruction= (e: React.FormEvent<HTMLFormElement>) => {
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
              setInstructionText(e.target.value) }}
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
    <Box sx={{padding: 3}}>
      <Typography variant="h5">
        Tags
      </Typography>
    </Box>
    </>
  )
}

export default RecipeContents