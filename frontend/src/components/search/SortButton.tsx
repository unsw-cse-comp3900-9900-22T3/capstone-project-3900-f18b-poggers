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
  recipes: RecipeThumbnail[],
  setRecipes: React.Dispatch<React.SetStateAction<RecipeThumbnail[]>>
}

const SortButton = ({ recipes, setRecipes }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [currentSortSelection, setCurrentSortSelection] = React.useState<string>(Sort.Relevance);
  const [searchParams, setSearchParams] = useSearchParams({});
  const sortParams = React.useMemo(() => searchParams.get('sort'), [searchParams]);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const menuItemStyles = { width: anchorRef.current && anchorRef.current.offsetWidth };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleSelectSort = (event: Event | React.SyntheticEvent, selection: string) => {
    handleClose(event);
    setCurrentSortSelection(selection);
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    const setSelectionFromParams = () => {
      if (['', null].includes(sortParams)) {
        // sort has not been selected yet
        setCurrentSortSelection(Sort.Relevance);
        return;
      }

      if (sortParams === Sort.Likes.toLowerCase()) {
        setCurrentSortSelection(Sort.Likes);
      } else if (sortParams === Sort.Contributor.toLowerCase()) {
        setCurrentSortSelection(Sort.Contributor);
      } else if (sortParams === Sort.Title.toLowerCase()) {
        setCurrentSortSelection(Sort.Title);
      }
      // relevance is selected by default
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
    const updateSearchParams = () => {
      searchParams.set("sort", currentSortSelection.toLowerCase());
      setSearchParams(searchParams);
    }

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