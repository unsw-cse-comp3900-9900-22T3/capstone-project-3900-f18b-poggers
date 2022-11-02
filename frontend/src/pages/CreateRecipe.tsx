import React from 'react'
import { IconButton, Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import RecipeContents from '../components/recipe/RecipeContents';
import { useNavigate } from 'react-router-dom';
import Image from 'mui-image';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';
import { Tag } from '../types/instacook-types';
type Props = {}

const CreateRecipe = (props: Props) => {

  const navigate = useNavigate();
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState<string[]>([]);
  const [preview, setPreview] = React.useState<string>("");
  const [ingredientsData, setIngredientsData] = React.useState<string[]>([]);
  const [instructionsData, setInstructionsData] = React.useState<string[]>([]);
  const [imgData, setImgData] = React.useState<any>('');

  const [tags, setTags] = React.useState<string[]>([]);
  const [tagsText, setTagsText] = React.useState<string[]>([]);
  const [allTags, setAllTags] = React.useState<Tag[]>([]);

  React.useEffect(() => {
    const setUserData = async () => {
      try {
        const { user } = await currentAuthenticatedUser();
        console.log(user)
        setUsername(user);

        const requestBody = {
          query: `
            query{
              getTags {
                  _id
                  content
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
        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }
        setAllTags(apiData.data.getTags);
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
    setUserData()
  }, [navigate])

  const bgStyles = {
    minHeight: `calc(100vh - 64px)`,
    backgroundColor: "#d3d3d3",
  }
  // const dataURI = ""

  const handleInstruction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("instruction"))
    setInstructionsData([...instructionsData, JSON.stringify(formData.get("instruction"))]);
    setInstructions([...instructions, JSON.parse(JSON.stringify(formData.get("instruction")))]);
  };

  const handleIngredient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("ingredient"))
    setIngredientsData([...ingredientsData, JSON.stringify(formData.get("ingredient"))]);
    setIngredients([...ingredients, JSON.parse(JSON.stringify(formData.get("ingredient")))]);
  };

  const handleTag = (newTag : string) => {
    let newTagText = "";
    for (let tag of allTags) {
      if (tag._id === newTag  && tag.content) {
        newTagText = tag.content
      }
    }
    const copy = [...tags];
    const copyTagsText = [...tagsText]
    let index = copy.indexOf(newTag)
    let indexTagsText = copyTagsText.indexOf(newTagText)
    if (index > -1) {
      console.log("removed tag")
      copy.splice(index,1)
      copyTagsText.splice(indexTagsText, 1)
      setTags(copy)
      setTagsText(copyTagsText)
    } else {
      console.log("added tag")
      setTags([...tags, newTag])
      setTagsText([...tagsText, newTagText])
    }
  };

  const handleRemoveIngredient = () => {
    const copy = [...ingredients];
    const copyData = [...ingredientsData];
    copy.pop();
    copyData.pop();
    setIngredients(copy);
    setIngredientsData(copyData);

  };

  const handleRemoveInstruction = () => {
    const copy = [...instructions];
    const copyData = [...instructionsData];
    copy.pop();
    copyData.pop();
    setInstructions(copy);
    setInstructionsData(copyData);

  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={bgStyles}
      sx={{ paddingLeft: 0 }}
    >
      <Container component="main" sx={{ border: "0px solid", borderRadius: 0, padding: 2, backgroundColor: 'white' }}>
        <CssBaseline />
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <TextField
              fullWidth
              id="recipeName"
              name="recipeName"
              label="Enter Recipe Name Here"
              variant="standard"
              onChange={(e) => {
                setRecipeName(e.target.value);
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
            <Typography variant="caption">
              posted by {username}
            </Typography>

          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-start"
            }}
          >
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Enter Description Here"
              variant="standard"
              onChange={(e) => {
                setDescription(JSON.stringify(e.target.value));
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >

            <Box>
              <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" onChange={(e) => {
                  e.preventDefault();
                  console.log(e.target.value);
                  if (e.target.files != null) {
                    setPreview(e.target.files[0].name);
                    console.log(e.target.files[0]);
                    // setImgData(URL.createObjectURL(e.target.files[0]));
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                      console.log("below")
                      console.log(reader.result);
                      setImgData(reader.result);
                    });
                    reader.readAsDataURL(e.target.files[0]);
                    // console.log(reader.result)
                  }
                }} />
                <AddPhotoAlternateIcon fontSize='large' sx={{}} />
              </IconButton>
              {imgData.length !== 0 && <Image
                src={imgData}
                duration={0}
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginTop: '30'
                }}
              />}
              {preview}
            </Box>

            {/* Ingredients and Instructions */}
            <RecipeContents
              ingredients={ingredients}
              instructions={instructions}
              tags={tagsText}
              allTags={allTags}
              handleInstruction={handleInstruction}
              handleIngredient={handleIngredient}
              handleRemoveIngredient={handleRemoveIngredient}
              handleRemoveInstruction={handleRemoveInstruction}
              handleTag={handleTag}
            />

            <Box
              paddingTop={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "flex-end"
              }}
            >
              <Button variant="contained"
                onClick={async () => {
                  const d = new Date();
                  const tagsData = tags.map(i => `"${i}"`);
                  const requestBody = {
                    query: `
                      mutation {
                        createRecipe(recipeInput:
                            {
                                title: "${recipeName}",
                                content: """[[${ingredientsData}], [${instructionsData}], [${(description)}], "${imgData}"]""",
                                dateCreated: "${d.toString()}",
                                tags: [${tagsData}]

                            }
                        ) {
                            _id
                            title
                            content
                            dateCreated
                            contributorUsername
                            numberLike
                            tags
                        }
                    }
                    `
                  }
                  console.log(requestBody)
                  const res = await fetch('http://localhost:3000/graphql', {
                    body: JSON.stringify(requestBody),
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  console.log("TRIGGERRREDD");
                  const apiData = await res.json();
                  console.log(apiData);

                  navigate(`/recipe/${apiData.data.createRecipe._id}`)
                }}
              >Done</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}
export default CreateRecipe