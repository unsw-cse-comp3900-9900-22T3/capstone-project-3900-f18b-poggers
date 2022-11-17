import { ThemeProvider } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Nav from './components/nav/Nav';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Recipe from './pages/Recipe';
import CreateRecipe from './pages/CreateRecipe';
import UpdateRecipe from './pages/UpdateRecipe';
import Discovery from './pages/Discovery';
import Search from './pages/Search';
import SavedRecipes from './pages/SavedRecipes';
import Theme from './themes/Theme';

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={Theme}>
        <Nav />
        <Routes>
          <Route path="/" element={<Discovery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:profileUsername" element={<Profile />} />
          <Route path="/createrecipe" element={<CreateRecipe />} />
          <Route path="/updaterecipe/:recipeId" element={<UpdateRecipe />} />
          <Route path="/recipe/:recipeId" element={<Recipe />} />
          <Route path="/search" element={<Search />} />
          <Route path="/savedrecipes" element={<SavedRecipes />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
