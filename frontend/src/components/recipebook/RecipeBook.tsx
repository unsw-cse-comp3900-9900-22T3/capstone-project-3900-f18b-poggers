import {Typography, Grid, Box} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
  // id of the recipe book
  id: string,

  // name of the recipe
  name: string,

  // id the selected recipe book
  selectedBookId: string,

  // toggle background colour of the recipe book
  changeSelectedBook: (id: string) => void,

  // remove recipe book from the list
  removeRecipeBook: (id: string) => void,
}

const RecipeBook = (props: Props) => {
  return (
    <Box sx={{ borderBottom: 1, paddingBottom: 1, borderColor: "#4F4F4F"}} onClick={() => {console.log("clicked"); props.changeSelectedBook(props.id)}}> 
      {/* Background colour changes when hovering, and toggles on click */}
      <Grid item container
        sx={{
          marginTop: 1,
          padding: 2,
          backgroundColor: props.selectedBookId === props.id ? '#eeeeee' : 'white',
          borderRadius: '5px',
          cursor: 'pointer',
          "&:hover": {
            backgroundColor: "#EDFAFC"
          }
        }}
        
        alignItems="center"
        direction="row"
      >

        {/* Recipe book name */}
        <Grid 
          item 
          xs={10} md={10} 
          justifyContent="flex-start"
          
        >
          <Typography>
            {props.name}
          </Typography>
        </Grid>

        {/* Clear button */}
        <Grid item xs={2} md={2} pl={{ md:2}} justifyContent="flex-end">
          <ClearIcon onClick={() => props.removeRecipeBook(props.id)} style={{ color: 'red' }}/>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RecipeBook