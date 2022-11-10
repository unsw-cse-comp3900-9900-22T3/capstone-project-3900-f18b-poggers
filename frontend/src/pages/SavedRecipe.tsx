import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Grid, Box, Avatar, TextField, IconButton } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';
import { Recipe, BookInfo } from '../types/instacook-types';
import { useNavigate, useParams } from 'react-router-dom';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';
import GroupsIcon from '@mui/icons-material/Groups';
import { red } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Clear';
// import Book from '../components/recipebook/Book';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import RecipeBook from '../components/recipebook/RecipeBook';
import RecipeFolder from '../components/recipebook/RecipeFolder';

type Props = {}

type SavedRecipe = {
  id: string,
  name: string,
  contributor: string, 
  like: number,
}

const SavedRecipe = (props: Props) => {
  const [newBookName, setNewBookName] = useState("");
  const [recipeBook, setRecipeBook] = useState<BookInfo[]>([
    {id: "1", name: "This is recipe 1"}, 
    {id: "2", name: "This is recipe 2"}, 
    {id: "3", name: "This is recipe 3"}, 
    {id: "4", name: "zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz zzz"} 
  ]);
  const [savedRecipe, setSavedRecipe] = useState<SavedRecipe[]>([
    {
      id: "1",
      name: "This is recipe 1",
      contributor: "somebody",
      like: 1234
    },
    {
      id: "2",
      name: "This is recipe 2",
      contributor: "somebodysome",
      like: 1235
    },
    {
      id: "3",
      name: "This is recipe 3asd as da sd as das d as das d asd asd  dsaa a sda sda sa sd",
      contributor: "somebody",
      like: 1236
    },
    {
      id: "4",
      name: "This is recipe 4",
      contributor: "somebody",
      like: 1236
    },

  ])
  const [selectedBook, setSelectedBook] = useState(""); 

  // highlight currently selected recipe book
  const handleSelectBook = (id: string) => {
    setSelectedBook(id);
  }

  // add new recipe book into the list 
  const addNewRecipeBook = () => {
    const newRecipeBook = {
      id: "69",
      name: newBookName,
    };
    setRecipeBook([...recipeBook, newRecipeBook]);
    setNewBookName("");
  }

  // remove recipe book from the list
  const removeRecipeBook = (id: string) => {
    const newBookList = recipeBook.filter((item: BookInfo) => item.id !== id);
    setRecipeBook(newBookList);
  }
  

  // removed saved recipe from the book
  const removeSavedRecipe = (id: string) => {
    const newRecipeList = savedRecipe.filter((item: BookInfo) => item.id !== id);
    setSavedRecipe(newRecipeList);
  }
  return (
    <Container
      sx={{ backgroundColor: 'white', paddingTop: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      <Grid container spacing={2} >
        {/* Saved Recipe Books column */}
        <Grid item xs={5} md={4} sx={{borderRight: 1, paddingRight: 2, minHeight: 'calc(100vh - 64px)'}}>

          {/* Title */}
          <Box sx={{
            borderColor: "#d2d2d2",
            borderBottom: 1,
            marginTop: 3,
            paddingBottom: 3,
          }}>
            <Typography variant="h4" align='center'>
              Saved Recipe Books
            </Typography>
          </Box>

          {/* List */}
          <Grid
            item
            justifyContent="center"
            alignItems="center"
            pl={2}
            pr={2}
          >
            {recipeBook.map((item, index) => (
              // Component to display list of recipe books
              <RecipeBook 
                key={index} 
                id={item.id} 
                name={item.name} 
                selectedBookId={selectedBook} 
                handleSelectBook={handleSelectBook}
                removeRecipeBook={removeRecipeBook}
              />
            ))}

            {/* Text input to create new recipe book */}  
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "flex-start"
              }}
            >
              <TextField
                fullWidth
                value={newBookName}
                id="bookName"
                name="bookName"
                label="Enter New Book Name"
                variant="standard"
                sx={{marginTop: 4}}
                onChange={(e) => { setNewBookName(e.target.value) }}
                InputProps={{
                  endAdornment:
                    <IconButton
                      color='secondary'
                      type="submit"
                      onClick={() => { addNewRecipeBook() }}
                    >
                      <AddIcon />
                    </IconButton>
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Recipe Folder column */}
        <Grid item xs={7} md={8}>
          <Box sx={{
            borderColor: "#d2d2d2",
            borderBottom: 1,
            marginTop: 3,
            paddingBottom: 3,
          }}>
            <Typography variant="h4" align='center'>
              Recipe Folder
            </Typography>
          </Box>

          <Grid
            item
            justifyContent="center"
            alignItems="center"
            pl={2}
            pr={2}
          >
            {savedRecipe.map((item, index) => (
              // Component to display list of saved recipes
              <RecipeFolder 
                id={item.id}
                name={item.name}
                contributor={item.contributor}
                like={item.like}
                key={index}
                removeSavedRecipe={removeSavedRecipe}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SavedRecipe