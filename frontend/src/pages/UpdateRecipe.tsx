import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Button, Container, CssBaseline, Grid, IconButton, TextField, Typography } from '@mui/material';
import Image from 'mui-image';
import React from 'react';
import { Tag, TagObj } from '../types/instacook-types';
import RecipeContents from '../components/recipe/RecipeContents';
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../types/instacook-types';

type Props = {}

const UpdateRecipe = (props: Props) => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = React.useState<Recipe>();
  const [description, setDescription] = React.useState<string>("");
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [contributorName, setContributorName] = React.useState<string>("Matthew");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState<string[]>([]);
  const [preview, setPreview] = React.useState<string>("");
  const [imgData, setImgData] = React.useState<any>('');
  const [tagOptions, setTagOptions] = React.useState<TagObj>({});
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  React.useEffect(() => {
    loadTags()
  }, [])

  React.useEffect(() => {
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
        const apiData = await res.json();
        setRecipe(apiData.data.getRecipeById);
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }

        setRecipeName(apiData.data.getRecipeById.title)
        setDescription(JSON.parse(apiData.data.getRecipeById.content)[2])
        setContributorName(apiData.data.getRecipeById.contributorUsername)
        setImgData(apiData.data.getRecipeById.image)
        if (apiData.data.getRecipeById.content[0] != null) {
          setIngredients(JSON.parse(apiData.data.getRecipeById.content)[0]);
          let tempIngredients = [];
          for (let x of (JSON.parse(apiData.data.getRecipeById.content)[0])) {
            tempIngredients.push(JSON.stringify(x));
          }
        }
        if (apiData.data.getRecipeById.content[1] != null) {
          setInstructions(JSON.parse(apiData.data.getRecipeById.content)[1]);
          let tempInstructions = [];
          for (let x of (JSON.parse(apiData.data.getRecipeById.content)[1])) {
            tempInstructions.push(JSON.stringify(x));
          }
        }

        let tagIds = [];
        for (const tag of apiData.data.getRecipeById.tags) {
          tagIds.push(tagOptions[tag])
        }
        console.log(tagOptions)
        console.log(tagIds)
        setSelectedValues([...tagIds])
      } catch (error) {
        console.log("error on fetching recipe", error);
      }
    };
    fetchRecipes();
  }, [recipeId, tagOptions]);

  const bgStyles = {
    minHeight: `calc(100vh - 64px)`,
    backgroundColor: "#d3d3d3",
  }

  const loadTags = async () => {
    const body = {
      query: `
        query {
          getTags {
            _id
            content
          }
        }
      `
    }

    const res = await fetch('http://localhost:3000/graphql', {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const apiData = await res.json();

    if (apiData.errors) {
      throw new Error(apiData.errors[0].message);
    }

    // create custom tag object
    const tagArr: Tag[] = apiData.data.getTags;
    const tags: TagObj = {}

    tagArr.map((tag: Tag) => (
      tags[tag.content] = tag._id
    ))
    setTagOptions(tags);
    console.log("cleared")
  }

  const handleTagAdd = (tags: string[]) => {
    setSelectedValues([...tags])
  }

  const handleTagCreation = async (tag: String) => {
    const requestBody = {
      query: `
      mutation {
        createTag(tagName: "${tag}")
      }
      `
    }
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
      loadTags();
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    if (recipe !== undefined) {
      const d = new Date();
      const tagsData = selectedValues.map(i => `"${i}"`);
      const ingredientsData = ingredients.map(i => `"${i}"`);
      const instructionsData = instructions.map(i => `"${i}"`);
      const requestBody = {
        query: `
          mutation {
            updateRecipe(recipeID: "${recipeId}", recipeInput:
              {
                title: "${recipeName}",
                image: "${imgData}",
                content: """[[${ingredientsData}], [${instructionsData}], [${JSON.stringify(description)}]]""",
                dateCreated: "${d.toString()}",
                tags: [${tagsData}]
              }
            )
          }
        `
      }

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
      navigate(`/recipe/${recipeId}`)

    }
  }

  const handleInstruction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // setInstructionsData([...instructionsData, JSON.stringify(formData.get("instruction"))]);
    setInstructions([...instructions, JSON.parse(JSON.stringify(formData.get("instruction")))]);
  };

  const handleIngredient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // setIngredientsData([...ingredientsData, JSON.stringify(formData.get("ingredient"))]);
    setIngredients([...ingredients, JSON.parse(JSON.stringify(formData.get("ingredient")))]);
  };

  const handleRemoveIngredient = () => {
    const copy = [...ingredients];
    // const copyData = [...ingredientsData];
    copy.pop();
    // copyData.pop();
    setIngredients(copy);
    // setIngredientsData(copyData);

  };

  const handleRemoveInstruction = () => {
    const copy = [...instructions];
    // const copyData = [...instructionsData];
    copy.pop();
    // copyData.pop();
    setInstructions(copy);
    // setInstructionsData(copyData);

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

          {/* Recipe Title */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <TextField
              value={recipeName}
              fullWidth
              id="recipeName"
              name="recipeName"
              variant="standard"
              onChange={(e) => {
                setRecipeName(e.target.value);
              }}
            />
          </Box>

          {/* Contributor Name */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-end"
            }}
          >
            <Typography variant="caption">
              posted by {contributorName}
            </Typography>

          </Box>

          {/* Recipe Description */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-start"
            }}
          >
            <TextField
              fullWidth
              value={description}
              id="description"
              name="description"
              label=""
              variant="standard"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >

            {/* Upload an Image */}
            <Box>
              <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" onChange={(e) => {
                  e.preventDefault();
                  if (e.target.files != null) {
                    setPreview(e.target.files[0].name);
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                      setImgData(reader.result);
                    });
                    reader.readAsDataURL(e.target.files[0]);
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
              handleInstruction={handleInstruction}
              handleIngredient={handleIngredient}
              handleRemoveIngredient={handleRemoveIngredient}
              handleRemoveInstruction={handleRemoveInstruction}
              handleTagCreation={handleTagCreation}
              tagOptions={tagOptions}
              selectedValues={selectedValues}
              handleTagAdd={handleTagAdd}
            />

            {/* Update Button */}
            <Box
              paddingTop={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "flex-end"
              }}
            >
              <Button variant="contained"
                onClick={handleUpdate}
              >Update</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}
export default UpdateRecipe