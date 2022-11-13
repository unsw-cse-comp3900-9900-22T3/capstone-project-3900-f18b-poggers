import { Container, Grid, Pagination } from '@mui/material';
import React from 'react'
import { useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import FilterSearchBox from '../components/search/FilterSearchBox';
import SortButton from '../components/search/SortButton';
import { Filter } from '../types/instacook-enums';
import { RecipeThumbnail, Tag, TagObj } from '../types/instacook-types';

type Props = {}

const Search = (_props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = React.useState<RecipeThumbnail[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [displayedRecipes, setDisplayedRecipes] = React.useState<RecipeThumbnail[]>([]);
  const [tagOptions, setTagOptions] = React.useState<TagObj>({});
  const tagParams = React.useMemo(() => searchParams.get('tags'), [searchParams]);
  const ingredientParams = React.useMemo(() => searchParams.get('ingredients'), [searchParams]);
  const displayedRecipesNum = 8;


  React.useEffect(() => {
    const loadRecipes = async () => {

      // if tag or ingredient params are not empty, do not reload recipes
      if (!['', null].includes(tagParams) || !['', null].includes(ingredientParams)) {
        console.log("STOPPED RELOAD")
        return;
      }
      console.log("Loading Recipes");
      const body = {
        query: `
          query {
            getListRecipeByTags(tags: []) {
              _id
              contributorUsername
              title
              content
              numberLike
              tags
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

      setRecipes([...apiData.data.getListRecipeByTags]);
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
    }


    loadRecipes();
    loadTags();
  }, [tagParams, ingredientParams])

  // run every time the page number changes
  React.useEffect(() => {
    const loadDisplayedRecipes = () => {
      // for 8 displayed recipes: 0-8, 8-16, 16-24, 24-32
      // = (page-1) * (number of displayed recipes) to (page) * (number of displayed recipes)
      const startRange = (page - 1) * displayedRecipesNum;
      const endRange = page * displayedRecipesNum;
      setDisplayedRecipes([...recipes.slice(startRange, endRange)]);

      searchParams.set('page', page.toString());
      setSearchParams(searchParams);
    }
    loadDisplayedRecipes();
  }, [page, recipes, setSearchParams, searchParams])


  return (
    <Container
      sx={{ backgroundColor: 'white', paddingBottom: 2, paddingTop: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      {/* Filter Container */}
      <Grid container sx={{ marginBottom: 2 }}>
        {/* Filter/Sort Dropdowns */}
        <Grid item sx={{ paddingLeft: 0.5, paddingRight: 0.5 }} md={10}>
          <FilterSearchBox filterType={Filter.Tags} options={tagOptions} setRecipes={setRecipes} recipes={recipes} />
        </Grid>

        <Grid item sx={{ paddingLeft: 0.5, paddingRight: 0.5 }} md={2}>
          <SortButton recipes={recipes} setRecipes={setRecipes} />
        </Grid>
      </Grid>

      {/* Recipe Search Result Container */}
      <Grid container>
        {displayedRecipes.map((recipe, idx) => (
          <Grid item md={3} sm={4} xs={6} sx={{ marginBottom: 2 }} key={idx}>
            <RecipeCard title={recipe.title} author={recipe.contributorUsername} img={recipe.image} numberOfLikes={recipe.numberLike} recipeId={recipe._id} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination Container */}
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Pagination size="large" color="secondary" showFirstButton showLastButton count={Math.ceil(recipes.length / displayedRecipesNum)} page={page} onChange={(_e, pageNum: number) => { setPage(pageNum) }} />
        </Grid>
      </Grid>

    </Container>
  )
}

export default Search