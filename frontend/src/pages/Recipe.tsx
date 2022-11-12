import React, { useState, useEffect } from 'react';
import { IconButton, Avatar, Divider, ListItemAvatar, CardContent, CardActionArea, ListItemText, List, ListItem, CardMedia, Card, Box, Container, CssBaseline, Grid, TextField, Typography, MenuItem, Menu } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import testimg from '../static/images/authbackground.jpeg'
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Image from 'mui-image';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';
import { Comment, BookInfo } from '../types/instacook-types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CheckItem from '../components/recipe/CheckItem';
type Props = {}

const Recipe = (props: Props) => {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState<string>("");
  const [recipeImage, setRecipeImage] = useState<string>("");
  const [recipeName, setRecipeName] = useState<string>("");
  const [contributorName, setContributorName] = useState<string>("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [similarRecipes, setSimilarRecipes] = useState([1, 2, 3, 4, 5, 6, 7])
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentField, setCommentField] = useState("");
  const [numberLike, setNumberLike] = useState(0);
  const [tags, setTags] = useState([""]);
  const [recipeLiked, setRecipeLiked] = useState<boolean>(false)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [recipeBook, setRecipeBook] = useState<BookInfo[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const requestBody = {
          query: `
            query {
              getRecipeById(recipeID: "${recipeId}") {
                  title
                  content
                  dateCreated
                  contributorUsername
                  numberLike
                  image
                  listComments {
                      userName
                      recipeID
                      content
                      dateCreated
                  }
                  tags
              }
          }
          `
        }

        const res = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("TRIGGERRREDD");
        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }
        console.log(apiData);
        setRecipeName(apiData.data.getRecipeById.title)
        setDescription(JSON.parse(apiData.data.getRecipeById.content)[2])
        setContributorName(apiData.data.getRecipeById.contributorUsername)
        setRecipeImage(apiData.data.getRecipeById.image)
        setNumberLike(apiData.data.getRecipeById.numberLike)
        setComments(apiData.data.getRecipeById.listComments)
        setTags(apiData.data.getRecipeById.tags)
        if (apiData.data.getRecipeById.content[0] != null) {
          setIngredients(JSON.parse(apiData.data.getRecipeById.content)[0]);
        }
        if (apiData.data.getRecipeById.content[1] != null) {
          setInstructions(JSON.parse(apiData.data.getRecipeById.content)[1]);
        }
      } catch (error) {
        console.log("error on fetching recipe", error);
      }
      const requestBody2 = {
        query: `
          query {
            isRecipeLiked(recipeID: "${recipeId}")
          }
        `
      }

      try {
        const res2 = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody2),
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        const apiData2 = await res2.json();
        if (apiData2.errors) {
          throw new Error(apiData2.errors[0].message);
        }
        if (apiData2.data.isRecipeLiked) {
          setRecipeLiked(true)
        } else {
          setRecipeLiked(false)
        }
      } catch (error) {
        console.log(error)
      }

    };

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
      } catch (error) {
        console.log("get recipe books failed: ", error);
      }
  
    }

    const setUserData = async () => {
      try {
        const { user } = await currentAuthenticatedUser();
        setUsername(user);
        setLoggedIn(true)
      } catch (e) {
        if (typeof e === "string") {
          console.log(e);
        } else if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log(e);
        }

        // go to login page if not authenticated
        // navigate('/login');
      }
    }
    setUserData();
    fetchRecipes();
    getRecipeBooks();
  }, [navigate, recipeId]);

  // drop menu handlers
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const similarRecipesCarousel = similarRecipes.map((recipe, key) =>
    <Grid key={key} item sm={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={testimg}
            alt="similar recipe"
          />
          <CardContent>
            <Typography variant="h5">
              Similar Recipe {recipe}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  // REMOVE THIS
  let items = []
  let carouselTab: any[] = []
  for (let i = 0; i < similarRecipesCarousel.length; i++) {
    carouselTab.push(similarRecipesCarousel[i]);
    if (carouselTab.length % 4 === 0) {
      items.push(carouselTab);
      carouselTab = [];
    }
  }
  items.push(carouselTab);

  const handleSubmitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("comment"))
    const d = new Date();
    const data: Comment = {
      userName: username,
      content: JSON.parse(JSON.stringify(formData.get("comment"))),
      dateCreated: d.toString(),
      recipeID: recipeId!
    };
    setComments([data, ...comments]);
    const requestBody = {
      query: `
        mutation {
          createComment(recipeID: "${recipeId}",
          content: "${JSON.parse(JSON.stringify(formData.get("comment")))}",
          dateCreated: "${d.toString()}"
          )
      }
      `
    }
    console.log(requestBody)
    try {
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

    } catch (error) {
      console.log(error)
    }

    setCommentField("");
  };

  const handleLike = async () => {
    if (recipeLiked) {
      setRecipeLiked(false)
      setNumberLike(numberLike - 1)
    } else {
      setRecipeLiked(true)
      setNumberLike(numberLike + 1)
    }
    const requestBody = {
      query: `
        mutation {
          likeRecipe(recipeID: "${recipeId}")
        }
      `
    }
    console.log(requestBody)
    try {
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

    } catch (error) {
      console.log(error)
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

  const likeStyles = {
    backgroundColor: '#FFF',
    padding: 0,
    borderRadius: 2,
    color: '#28343c',
    margin: 0.5,
    minWidth: "50px",
    justifyItems: "center",
  }

  const likeStylesUnAuth = {
    backgroundColor: '#FFF',
    padding: 0,
    borderRadius: 2,
    color: '#28343c',
    margin: 0.5,
    minWidth: "60px",
    // '&:hover': {
    //   backgroundColor: '#28343c',
    //   color: '#fff',
    // },
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{
        backgroundColor: "#d3d3d3",
      }}
      sx={{ paddingLeft: 0 }}
    >
      <Container component="main" sx={{ border: "0px solid", borderRadius: 0, padding: 2, backgroundColor: 'white' }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">
            {recipeName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: "flex-end"
          }}
        >

          <Typography variant="caption"
            onClick={() => { navigate(`/profile/${contributorName}`) }}
            sx={{ cursor: "pointer" }}>
            posted by {contributorName}
          </Typography>
          {(contributorName === username) &&
            <IconButton onClick={() => { (navigate(`/updaterecipe/${recipeId}`)) }} color={"secondary"}>
              <EditIcon />
            </IconButton>}

        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {description}
        </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
          <Card
            variant="outlined"
          >
            <Image
              src={recipeImage}
              duration={0}
              style={{
                paddingLeft: 0,
                paddingRight: 0,
                marginTop: '30'
              }}
            />
          </Card>
          <Box sx={{display: "flex"}}>
            <Box sx={{display: "flex", width: "50%"}}>
            {tags.map((tag, key) =>
              <Box sx={tagStyles} key={key}>
              <Typography variant='body2'>
                {tag}
              </Typography>
            </Box>
            )}

            </Box>
            <Box sx={{
            display: "flex",
            width: "50%",
            alignItems: "flex-end",
            flexDirection: "column"}}>
              {loggedIn ?
                <Box>
                  {/* a playlist button with dropdown menu */}
                  <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{marginRight: 2, borderRadius: 2, padding: 0}}
                  >
                    <PlaylistAddIcon sx={{fontSize: "30px", color: "#28343c"}}/>
                  </IconButton>

                  {/* A menu by clicking on the playlist button */}
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: 250,
                        width: '20ch',
                      },
                    }}
                  >
                      {recipeBook.length !== 0 ? (recipeBook.map((item, index) => (
                        // checkbox component indicating that the recipe is saved in the book
                        <MenuItem key={index}>
                          <CheckItem bookId={item._id} name={item.name} recipeId={`"${recipeId}"`}/>
                        </MenuItem>
                      ))) : (
                        // go to recipe book page if none has been created
                        <MenuItem onClick={() => navigate("/savedrecipe")}>
                          Create Recipe Book
                        </MenuItem>
                      )}
                  </Menu>

                  <IconButton sx={likeStyles} onClick={handleLike}>
                    <Grid container direction="row" alignItems="center" justifyItems="center">
                      {recipeLiked ? <FavoriteIcon sx={{ fontSize: "30px", marginRight: 0.5}}/> : <FavoriteBorderIcon sx={{ fontSize: "30px", marginRight: 0.5}}/>}
                      <Typography>
                        {numberLike}
                      </Typography>
                    </Grid>
                  </IconButton>
                </Box>
                :
                // <Box sx={likeStyles}>
                <>
                <Box sx={likeStylesUnAuth}>
                  <Grid container direction="row" alignItems="center">
                    <FavoriteBorderIcon sx={{ fontSize: "30px", marginRight: 0.5}}/>
                    <Typography>
                      {numberLike}
                    </Typography>
                  </Grid>
                </Box>
                </>
                  // <Box>
                }
            </Box>
          </Box>
          <Grid container spacing={3} sx={{ padding: 3}}>
            <Grid item sm={3}>
              <Typography variant="h5">
                Ingredients
              </Typography>
              <ul>
                {ingredients.map((ingredient, key) =>
                  <li key={key}>
                    <ListItemText primary={ingredient} />
                  </li>
                )}
              </ul>
            </Grid>
            <Grid item sm={8}>
              <Typography variant="h5">
                Cooking Instructions
              </Typography>
            {/* </Box> */}
              <List>
                {instructions.map((instruction, key) =>
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
            </Grid>

          </Grid>
        </Box>
        <Box
          sx={{
            padding: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">
            Similar Recipes
          </Typography>
          <Carousel
            autoPlay={false}
            animation={"slide"}
          >
            {
              items.map((item, key) =>
                <Grid key={key} container spacing={2} sx={{ padding: 3 }}>
                  {item}
                </Grid>
              )
            }
          </Carousel>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmitComment}
          sx={{
            padding: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{
            paddingBottom: 3
          }}>
            Comments
          </Typography>
          <Box
            sx={loggedIn ? {
              display: 'flex',
              alignItems: "flex-start"
            } : {
              display: 'none',
              alignItems: "flex-start"
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ maring: "5" }} alt={username} src="" />
            </ListItemAvatar>
            <TextField
              value={commentField}
              fullWidth
              variant='standard'
              InputProps={{
                endAdornment:
                  <IconButton
                    color='secondary'
                    type="submit">
                    <SendIcon />
                  </IconButton>
              }}
              name="comment"
              id="comment"
              placeholder="Add a Comment"
              onChange={(e) => {
                setCommentField(e.target.value);
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-end"
            }}
          >
          </Box>
          <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
            {comments.map((comment, key) =>
              <div key={key}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={comment.userName} src="" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.userName}
                    secondary={
                      <Typography variant="body2">
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" />
              </div>
            )}
          </List>
        </Box>
      </Container>
    </Grid>
  )
}

export default Recipe