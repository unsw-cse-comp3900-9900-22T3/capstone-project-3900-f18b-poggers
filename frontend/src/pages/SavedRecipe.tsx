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
  const [savedRecipe, setsavedRecipe] = useState<SavedRecipe[]>([
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
  
  return (
    <Container
      sx={{ backgroundColor: 'white', paddingTop: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      <Grid container spacing={2} >
        {/* List of recipe books */}
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

              <Box sx={{ borderBottom: 1, paddingBottom: 1, borderColor: "#4F4F4F"}} key={index}> 
                <Grid item container
                  sx={{
                    marginTop: 1,
                    padding: 2,
                    backgroundColor: selectedBook === item.id ?'#eeeeee' : 'white',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    "&:hover": {
                      backgroundColor: '#EDFAFC'
                    }
                  }}
                  
                  alignItems="center"
                  direction="row"
                >
                  <Grid 
                    item 
                    xs={9} md={10} 
                    justifyContent="flex-start"
                    onClick={() => {setSelectedBook(item.id);console.log("SELECTED")}}
                  >
                    <Typography>
                      {item.name}
                    </Typography>
                  </Grid>

                  <Grid item xs={3} md={2} pl={{ md:2}} justifyContent="flex-end">
                    <ClearIcon onClick={() => alert("delete book")} style={{ color: 'red' }}/>
                  </Grid>
                </Grid>
              </Box>
            ))}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-start"
            }}
          >
            <TextField
              fullWidth
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
                    type="submit">
                    <AddIcon />
                  </IconButton>
              }}
            />
          </Box>
          </Grid>


          {/* Text input to create list */}

        </Grid>

        {/* List of recipe saved in the book */}
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

              <Box sx={{ borderBottom: 1, paddingBottom: 1, borderColor: "#4F4F4F"}} key={index}> 
                <Grid item container
                  sx={{
                    marginTop: 1,
                    padding: 2,
                    borderRadius: '5px',
                    cursor: 'pointer',
                    "&:hover": {
                      backgroundColor: '#EDFAFC'
                    }
                  }}
                  
                  alignItems="center"
                  direction="row"
                >
                  <Grid 
                    item
                    container 
                    direction="row" 
                    alignItems="center"  
                    xs={8} md={4} mr={4}
                    justifyContent="flex-start"
                    onClick={() => alert("go to recipe")}
                    // onClick={() => {setSelectedBook(item.id);console.log("SELECTED")}}
                  >
                    <Grid item md={3}>
                      <MenuBookIcon sx={{ fontSize: "25px"}}/>
                    </Grid>

                    <Grid item md={8}>
                      <Typography sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {item.name}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid 
                    item 
                    container 
                    direction="row" 
                    alignItems="center" 
                    xs={8} md={3} mr={1} 
                    justifyContent="flex-start" 
                    onClick={() => alert("go to profile")}
                  >
                    <PersonIcon sx={{ fontSize: "25px", marginRight: 0.5}}/>
                    <Typography>
                      {item.contributor}
                    </Typography>
                  </Grid>

                  <Grid 
                    item 
                    container 
                    direction="row" 
                    alignItems="center" 
                    xs={8} md={2} mr={1} 
                    justifyContent="flex-start"
                  >
                    <FavoriteIcon sx={{ fontSize: "16px", marginRight: 0.5}}/> 
                    <Typography>
                      {item.like}
                    </Typography>
                  </Grid>

                  <Grid item xs={2} md={2} pl={{md:12}} justifyContent="flex-end">
                    <ClearIcon onClick={() => alert("delete book")} style={{ color: 'red' }}/>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SavedRecipe