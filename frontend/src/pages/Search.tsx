import { Container, Grid, Pagination } from '@mui/material';
import React from 'react'
import { useSearchParams } from 'react-router-dom';
import DiscoveryCardLoader from '../components/RecipeCardPlaceholder';
import RecipeCard from '../components/RecipeCard';
import FilterSearchBox from '../components/search/FilterSearchBox';
import SortButton from '../components/search/SortButton';
import { RecipeThumbnail, Tag, TagObj } from '../types/instacook-types';

type Props = {}

const displayedRecipesNum = 8;

const placeholderArr = [0, 1, 2, 3, 4, 5, 6, 7];

const Search = (_props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = React.useState<RecipeThumbnail[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);
  const [displayedRecipes, setDisplayedRecipes] = React.useState<RecipeThumbnail[]>([]);
  const [tagOptions, setTagOptions] = React.useState<TagObj>({});
  const tagParams = React.useMemo(() => searchParams.get('tags'), [searchParams]);
  const queryParams = React.useMemo(() => searchParams.get('query'), [searchParams]);

  React.useEffect(() => {
    /**
     * Loads recipes only by the user inputted tags
     */
    const loadRecipesByTags = async () => {
      const tags = searchParams.getAll('tags')[0].split(',');
      const body = {
        query: `
          query {
            getListRecipeByTags(tags: [${tags.map((tag) => '"' + tag + '"')}]) {
              _id
              contributorUsername
              title
              content
              numberLike
              tags
              image
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
      setLoading(false);
    }

    /**
     * Loads recipes only by the user inputted title
     */
    const loadRecipesByTitle = async () => {
      const body = {
        query: `
            query {
              getListRecipeByTitle(keywords:"${queryParams}") {
                _id
                image
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

      setRecipes([...apiData.data.getListRecipeByTitle]);
      setLoading(false);
    }

    /**
     * Loads recipes and sets recipe list state
     */
    const loadRecipes = async () => {
      // if tag params are not empty (at least 1 tag has been selected), do not reload recipes
      if (!['', null].includes(tagParams)) {
        // if query is empty but tags have been selected, then search by tag
        if (queryParams === null || queryParams.length === 0) {
          loadRecipesByTags();
        }
        return;
      }

      loadRecipesByTitle();
    }

    /**
     * Loads tag filter options
     */
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

    /**
     * Resets page number to 1
     */
    const resetPage = () => {
      setPage(1);
    }

    loadRecipes();
    loadTags();
    resetPage();
  }, [tagParams, queryParams])

  React.useEffect(() => {
    /**
     * Displays displayedRecipesNum number of recipes out of the list of recipes
     */
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
          <FilterSearchBox options={tagOptions} setRecipes={setRecipes} recipes={recipes} setLoading={setLoading} />
        </Grid>

        <Grid item sx={{ paddingLeft: 0.5, paddingRight: 0.5 }} md={2}>
          <SortButton recipes={recipes} setRecipes={setRecipes} />
        </Grid>
      </Grid>

      {/* Recipe Search Result Container */}
      <Grid container>
        {loading ?
          placeholderArr.map((index) => (
            <Grid item md={3} sm={4} xs={6} sx={{ marginBottom: 2 }} key={index}>
              <DiscoveryCardLoader />
            </Grid>
          ))
          :
          displayedRecipes.map((recipe, idx) => (
            <Grid item md={3} sm={4} xs={6} sx={{ marginBottom: 2 }} key={idx}>
              <RecipeCard title={recipe.title} author={recipe.contributorUsername} img={recipe.image} numberOfLikes={recipe.numberLike} recipeId={recipe._id} />
            </Grid>
          ))
        }
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