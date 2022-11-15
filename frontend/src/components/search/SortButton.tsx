import React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, Paper, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Sort } from '../../types/instacook-enums';
import { useSearchParams } from 'react-router-dom';
import { RecipeThumbnail } from '../../types/instacook-types';

type Props = {
  // list of recipes
  recipes: RecipeThumbnail[],

  // function to set recipe state
  setRecipes: React.Dispatch<React.SetStateAction<RecipeThumbnail[]>>
}

const SortButton = ({ recipes, setRecipes }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [currentSortSelection, setCurrentSortSelection] = React.useState<Sort>(Sort.Likes);
  const [searchParams, setSearchParams] = useSearchParams({});
  const sortParams = React.useMemo(() => searchParams.get('sort'), [searchParams]);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const menuItemStyles = { width: anchorRef.current && anchorRef.current.offsetWidth };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);

  /**
   * Closes dropdown menu
   *
   * @param event react event
   */
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  /**
   * Selects a given sorting option
   *
   * @param event react event
   * @param selection sort option to select
   */
  const handleSelectSort = (event: Event | React.SyntheticEvent, selection: Sort) => {
    handleClose(event);
    setCurrentSortSelection(selection);
  }

  /**
   * Closes menu if tab or esc is pressed
   *
   * @param event react keyboard event
   */
  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    /**
     * Sets selected sort options from search parameters
     */
    const setSelectionFromParams = () => {
      const sortOptions: string[] = [Sort.Contributor.toLowerCase(), Sort.Likes.toLowerCase(), Sort.Title.toLowerCase()];
      if (['', null].includes(sortParams) || !sortParams || !sortOptions.includes(sortParams)) {
        // sort has not been selected yet or is not a valid option
        setCurrentSortSelection(Sort.Likes);
        return;
      }

      if (sortParams === Sort.Likes.toLowerCase()) {
        setCurrentSortSelection(Sort.Likes);
      } else if (sortParams === Sort.Contributor.toLowerCase()) {
        setCurrentSortSelection(Sort.Contributor);
      } else if (sortParams === Sort.Title.toLowerCase()) {
        setCurrentSortSelection(Sort.Title);
      }

    }
    setSelectionFromParams();
  }, [sortParams]);

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);

  React.useEffect(() => {
    /**
     * Updates search params based off sort selection
     */
    const updateSearchParams = () => {
      searchParams.set("sort", currentSortSelection.toLowerCase());
      setSearchParams(searchParams);
    }

    /**
     * Sorts recipes based off current sort option
     */
    const handleSortRecipes = () => {
      if (currentSortSelection === Sort.Likes) {
        setRecipes(recipes.sort((a, b) => b.numberLike - a.numberLike));
      } else if (currentSortSelection === Sort.Title) {
        setRecipes(recipes.sort((a, b) => a.title.localeCompare(b.title)));
      } else if (currentSortSelection === Sort.Contributor) {
        setRecipes(recipes.sort((a, b) => a.contributorUsername.localeCompare(b.contributorUsername)));
      }
    }
    updateSearchParams();
    handleSortRecipes();
  }, [currentSortSelection, recipes, setRecipes, setSearchParams, searchParams])

  return (
    <>
      <Button
        ref={anchorRef}
        fullWidth
        color="secondary"
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        variant="outlined"
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ textTransform: 'none' }}
      >

        <Box>
          <Typography variant="body2" sx={{ textTransform: 'none' }}>Sort by:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{currentSortSelection}</Typography>
        </Box>

      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  onKeyDown={handleListKeyDown}
                >
                  {currentSortSelection !== Sort.Title &&
                    <MenuItem
                      sx={menuItemStyles}
                      onClick={(e) => handleSelectSort(e, Sort.Title)}>
                      Title
                    </MenuItem>
                  }

                  {currentSortSelection !== Sort.Contributor &&
                    <MenuItem
                      sx={menuItemStyles}
                      onClick={(e) => handleSelectSort(e, Sort.Contributor)}>
                      Contributor
                    </MenuItem>
                  }

                  {currentSortSelection !== Sort.Likes &&
                    <MenuItem
                      sx={menuItemStyles}
                      onClick={(e) => handleSelectSort(e, Sort.Likes)}>
                      Likes
                    </MenuItem>
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default SortButton