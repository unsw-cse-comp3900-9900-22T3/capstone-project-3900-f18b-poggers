import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import SidebarSubheading from './SidebarSubheading';
import SidebarButtonItem from './SidebarButtonItem';
import { Tag, TagObj } from '../../types/instacook-types';

type Props = {
  loggedIn: boolean,
  toggleSidebar: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void
}

const Sidebar = (props: Props) => {
  const [tagIds, setTagIds] = React.useState<TagObj>({});

  React.useEffect(() => {
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

      tagArr.map((tag: Tag) => {
        tags[tag.content] = tag._id;
      })
      setTagIds(tags);
    }
    loadTags();
  }, [])

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={props.toggleSidebar(false)}
      onKeyDown={props.toggleSidebar(false)}
    >
      {!props.loggedIn && <>
        <Box sx={{ padding: 1, display: { xs: 'block', sm: 'block', md: 'none' } }}>
          <Button
            variant="contained"
            sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, width: '100%', marginTop: 1 }}
            color="secondary"
            component={Link}
            to={"/login"}
          >
            <Typography align="center">Log In</Typography>
          </Button>
        </Box>
      </>}
      <Divider />

      <SidebarSubheading text="Meals" />
      <SidebarButtonItem text="Breakfast Recipes" tagId={tagIds['Breakfast']} />
      <SidebarButtonItem text="Brunch Recipes" tagId={tagIds['Brunch']} />
      <SidebarButtonItem text="Dinner Recipes" tagId={tagIds['Dinner']} />
      <SidebarButtonItem text="Lunch Recipes" tagId={tagIds['Lunch']} />
      <Divider />
      <SidebarSubheading text="Meat" />
      <SidebarButtonItem text="Beef Recipes" tagId={tagIds['Beef']} />
      <SidebarButtonItem text="Chicken Recipes" tagId={tagIds['Chicken']} />
      <SidebarButtonItem text="Pork Recipes" tagId={tagIds['Pork']} />
      <Divider />
      <SidebarSubheading text="Drinks" />
      <SidebarButtonItem text="Cocktail Recipes" tagId={tagIds['Cocktail']} />
      <SidebarButtonItem text="Coffee Recipes" tagId={tagIds['Coffee']} />
      <SidebarButtonItem text="Smoothie Recipes" tagId={tagIds['Smoothie']} />
      <SidebarButtonItem text="Tea Recipes" tagId={tagIds['Tea']} />
      <Divider />
      <SidebarSubheading text="Desserts" />
      <SidebarButtonItem text="Cake Recipes" tagId={tagIds['Cake']} />
      <SidebarButtonItem text="Cookie Recipes" tagId={tagIds['Cookie']} />
      <SidebarButtonItem text="Ice Cream Recipes" tagId={tagIds['Ice Cream']} />
      <Divider />
      <SidebarSubheading text="Cuisines" />
      <SidebarButtonItem text="Australian Recipes" tagId={tagIds['Australian']} />
      <SidebarButtonItem text="Chinese Recipes" tagId={tagIds['Chinese']} />
      <SidebarButtonItem text="French Recipes" tagId={tagIds['French']} />
      <SidebarButtonItem text="Japanese Recipes" tagId={tagIds['Japanese']} />
      <SidebarButtonItem text="Korean Recipes" tagId={tagIds['Korean']} />
      <SidebarButtonItem text="Indian Recipes" tagId={tagIds['Indian']} />
      <SidebarButtonItem text="Middle Eastern Recipes" tagId={tagIds['Middle Eastern']} />
      <SidebarButtonItem text="Vietnamese Recipes" tagId={tagIds['Vietnamese']} />
      <Divider />
      <SidebarSubheading text="Ingredients" />
      <SidebarButtonItem text="Carrot Recipes" tagId={tagIds['Carrot']} />
      <SidebarButtonItem text="Cheese Recipes" tagId={tagIds['Cheese']} />
      <SidebarButtonItem text="Egg Recipes" tagId={tagIds['Egg']} />
      <SidebarButtonItem text="Noodles Recipes" tagId={tagIds['Noodles']} />
      <SidebarButtonItem text="Rice Recipes" tagId={tagIds['Rice']} />
      <Divider />
      <SidebarSubheading text="Cooking Methods" />
      <SidebarButtonItem text="Baked Recipes" tagId={tagIds['Baked']} />
      <SidebarButtonItem text="Deep Fried Recipes" tagId={tagIds['Deep Fried']} />
      <SidebarButtonItem text="Grilled Recipes" tagId={tagIds['Grilled']} />
      <SidebarButtonItem text="Pan Fried Recipes" tagId={tagIds['Pan Fried']} />
      <SidebarButtonItem text="Steamed Recipes" tagId={tagIds['Steamed']} />
      <SidebarButtonItem text="Stir Fried Recipes" tagId={tagIds['Stir Fried']} />
    </Box>
  )
}

export default Sidebar