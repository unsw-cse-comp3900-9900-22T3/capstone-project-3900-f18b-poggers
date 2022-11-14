import { useState, useEffect } from 'react';
import { Typography, Container, Grid, Box, TextField, IconButton } from '@mui/material';
import { BookInfo, SavedRecipeInfo } from '../types/instacook-types';
import { useNavigate } from 'react-router-dom';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';
import AddIcon from '@mui/icons-material/Add';
import RecipeBook from '../components/recipebook/RecipeBook';
import RecipeFolder from '../components/recipebook/RecipeFolder';

type Props = {}

const SavedRecipes = (props: Props) => {
  const [newBookName, setNewBookName] = useState("");
  const [recipeBook, setRecipeBook] = useState<BookInfo[]>([]);
  const [savedRecipe, setSavedRecipe] = useState<SavedRecipeInfo[]>([])
  const [selectedBook, setSelectedBook] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Check if the user is authenticated, and get logged-in user detail
     */
    const setUserData = async () => {
      console.log("setUserData in Feed.tsx called");
      try {
        await currentAuthenticatedUser();
      } catch (e) {
        if (typeof e === "string") {
          console.log(e);
        } else if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log(e);
        }

          // go to login page if not authenticated
          navigate('/login');
      }
    }
    setUserData();
    getRecipeBooks();
  },[navigate, selectedBook]);

  /**
   * Get list of recipe books
   */
  const getRecipeBooks = async () => {
    try {
      const requestBody = {
        query: `
          query {
            getListOfRecipeBook {
              _id
              name
            }
          }
        `
      };
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

      const books = apiData.data.getListOfRecipeBook;
      const newBooks: BookInfo[] = books.map((item: BookInfo) => ({
        _id: item._id,
        name: item.name,
      }))

      console.log(newBooks);

      setRecipeBook([...newBooks.reverse()]);
      selectedBook === "" && setSavedRecipe([]);
    } catch (error) {
      console.log("get recipe books failed: ", error);
    }

  }

  /**
   * Toggle background colour when user clicks on the recipe book
   * 
   * @param id ID of the recipe book
   */
  const changeSelectedBook = async (id: string) => {
    try {
      setSelectedBook(id);
      const requestBody = {
        query: `
          query {
            getSavedRecipe(recipeBookID: "${id}") {
              _id
              title
              contributorUsername
              numberLike
            }
          }
        `
      };
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

      const savedRecipe = apiData.data.getSavedRecipe;
      const newSavedRecipe: SavedRecipeInfo[] = savedRecipe.map((item: SavedRecipeInfo) => ({
        _id: item._id,
        title: item.title,
        contributorUsername: item.contributorUsername,
        numberLike: item.numberLike
      }))

      setSavedRecipe([...newSavedRecipe]);

    } catch (error) {
      console.log("get saved recipe failed:", error);
    } 
      
  }

  /**
   * Add new recipe book into the list
   */
  const addNewRecipeBook = async () => {
    const dateCreated = new Date();
    try {
      const requestBody = {
        query: `
          mutation {
            createRecipeBook(recipeBookName: "${newBookName}", dateCreated:"${dateCreated.toString()}")
          }
        `
      };
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

      getRecipeBooks();
    } catch(error) {
      console.log("add recipe failed", error);
    }
    setNewBookName("");
  }

  /**
   * Remove recipe book from the list by ID 
   * 
   * @param id ID of the recipe book 
   */
  const removeRecipeBook = async (id: string) => {
    try {
      
      const requestBody = {
        query: `
          mutation {
            deleteRecipeBook(recipeBookID: "${id}")
          }
        `
      };
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }
      const newRecipeBook = recipeBook.filter((item: BookInfo) => item._id !== id);
      setRecipeBook(newRecipeBook);
      id === selectedBook && setSelectedBook("");

    } catch(error) {
      console.log("remove recipe failed", error);
    }
  }
  
  /**
   *  Remove recipe ID from the book that is saved into 
   * 
   * @param id ID of the recipe
   */
  const removeSavedRecipe = async (id: string) => {
    try {
      const requestBody = {
        query: `
          mutation {
            deleteRecipeIdInBook(
              recipeBookID: "${selectedBook}", 
              recipeID: "${id}"
            )
          }
        `
      };
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }
      const newRecipeList = savedRecipe.filter((item: SavedRecipeInfo) => item._id !== id);
      setSavedRecipe(newRecipeList);
    } catch(error) {
      console.log("remove recipe failed", error);
    }
  }
  return (
    <Container
      sx={{ backgroundColor: 'white', paddingTop: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      <Grid container spacing={2} >
        {/* Saved Recipe Books column */}
        <Grid item xs={12} md={4} sx={{borderRight: {md: 1}, paddingRight: 2, minHeight: 'calc(100vh - 64px)'}}>

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
                id={item._id} 
                name={item.name} 
                selectedBookId={selectedBook} 
                changeSelectedBook={changeSelectedBook}
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
        <Grid item xs={12} md={8}>
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
                id={item._id}
                title={item.title}
                contributor={item.contributorUsername}
                like={item.numberLike}
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

export default SavedRecipes