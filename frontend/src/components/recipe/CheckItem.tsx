import { Checkbox, FormControlLabel } from '@mui/material';
import { useState, useEffect } from 'react';

type Props = {
  // id of the recipe book
  bookId: string,

  // id of the recipe
  recipeId: string,

  // name of the recipe
  name: string,
}

const CheckItem = (props: Props) => {
  const [isInBook, setIsInBook] = useState(false);

  useEffect(() => {
    /**
     * Check if the recipe is saved in any books
     */
    const checkRecipeInBook = async () => {
      try {
        const requestBody = {
          query: `
            query {
              checkRecipeInBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
            }
          `
        };
        const res = await fetch('http://localhost:6921/graphql', {
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
        setIsInBook(apiData.data.checkRecipeInBook);
      } catch (error) {
        console.log("remove recipe failed", error);
      }
    }
    checkRecipeInBook();
  })


  /**
   *  Remove recipe ID from the book that is saved into
   */
  const removeRecipeIdFromBook = async () => {
    try {
      const requestBody = {
        query: `
          mutation {
            deleteRecipeIdInBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
          }
        `
      };

      const res = await fetch('http://localhost:6921/graphql', {
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

      setIsInBook(false);
    } catch (error) {
      console.log("remove recipe failed", error);
    }
  };

  /**
   * Add recipe ID into the book
   */
  const addRecipeIdToBook = async () => {
    try {
      const requestBody = {
        query: `
          mutation {
            addRecipeToBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
          }
        `
      };

      const res = await fetch('http://localhost:6921/graphql', {
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

      setIsInBook(true);
    } catch (error) {
      console.log("add to recipe failed", error);
    }

  };

  return (
    <FormControlLabel
      onClick={() => isInBook ? removeRecipeIdFromBook() : addRecipeIdToBook()}
      control={<Checkbox checked={isInBook} />}
      label={props.name}
    />
  )
}

export default CheckItem;