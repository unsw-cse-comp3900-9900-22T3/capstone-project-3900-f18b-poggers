import React from 'react'
import { Button, Divider, Modal, IconButton, ListItemText, List, ListItem, Box, Grid, TextField, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Tag } from '../../types/instacook-types';

type Props = {
  ingredients : string[],
  instructions : string[],
  tags: string[],
  allTags: Tag[],
  // instructionText : string,
  // ingredientText: string,
  handleTag: (newTag : string) => void,
  handleInstruction: (event: React.FormEvent<HTMLFormElement>) => void,
  handleIngredient: (event: React.FormEvent<HTMLFormElement>) => void,
  handleRemoveIngredient: () => void,
  handleRemoveInstruction: () => void,
}

const RecipeContents = (props: Props) => {

  const [open, setOpen] = React.useState(false);
  const [ingredientText, setIngredientText] = React.useState<string>("");
  const [instructionText, setInstructionText] = React.useState<string>("");
  const [modalTags, setmodalTags] = React.useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    setmodalTags(props.tags)
  })

  const submitIngredient = (e: React.FormEvent<HTMLFormElement>) => {
    props.handleIngredient(e)
    setIngredientText('');
  }

  const submitInstruction = (e: React.FormEvent<HTMLFormElement>) => {
    props.handleInstruction(e)
    setInstructionText('');
  }

  const handleModal = () => {
    handleOpen()
  }

  const handleTagClick = (tag : Tag) => {
    if (tag._id) {
      props.handleTag(tag._id)
    }
  }

  const tagStyles = {
    display: "flex",
    backgroundColor: '#28343c',
    paddingRight: 1,
    paddingLeft: 1,
    borderRadius: 2,
    color: '#FFF',
    margin: 0.5,
    justifyItems: "center",
    alignItems: "center",
  }

  const tagButtonUnclickedStyles = {
    backgroundColor: '#FFF',
    padding: 1,
    borderRadius: 2,
    color: '#28343c',
    margin: 0.5,
    minWidth: "60px",
    '&:hover': {
      backgroundColor: '#FFF',
      color: '#28343c',
    },
  }

  const tagButtonClickedStyles = {
    backgroundColor: '#28343c',
    padding: 1,
    borderRadius: 2,
    color: '#fff',
    margin: 0.5,
    minWidth: "60px",
    '&:hover': {
      backgroundColor: '#28343c',
      color: '#fff',
    },
  }

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

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
    <>
      <Typography variant="h5">
        Tags
      </Typography>
      <Box sx={{display: "flex", width: "100%"}}>
            {modalTags.map((tag, key) =>
              <Box sx={tagStyles} key={key}>
              <Typography variant='body2'>
                {tag}
              </Typography>
            </Box>
            )}
          </Box>
      <IconButton
        color='secondary'
        onClick={() => { handleModal() }}>
        <AddIcon />
      </IconButton>
    </>
    </Box>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select Tags
          </Typography>
          <Divider variant="middle" sx={{ mt: 2 }}/>
            <Box sx={{display: "flex", width: "100%", paddingTop: 1}}>
              {props.allTags.map((tag, key) =>
                <IconButton
                sx={(modalTags.includes(tag.content!)) ? tagButtonClickedStyles : tagButtonUnclickedStyles}
                key={key}
                onClick={ () => handleTagClick(tag) }
                >
                <Typography variant='body2'>
                  {tag.content}
                </Typography>
              </IconButton>
              )}
            </Box>
            <Box
              paddingTop={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "flex-end"
              }}
            >
            <Button
            type="submit"
            variant="contained"
            color="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
            </Box>
        </Box>
      </Modal>
    </>
  )
}

export default RecipeContents