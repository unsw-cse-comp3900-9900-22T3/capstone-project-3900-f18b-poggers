import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useState, useEffect } from 'react';

type Props = {
  bookId: string,
  recipeId: string,
  name: string,
}

const CheckItem = (props: Props) => {
  const [isInBook, setIsInBook] = useState(false);

  useEffect(() => {
    // check if the recipe is saved in the book
    const checkRecipeInBook = async () => {
      try {
        const requestBody = {
          query: `
            query {
              checkRecipeInBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
            }
          `
        };
        const res = await fetch('http://localhost:3000/graphql', {
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
      } catch(error) {
        console.log("remove recipe failed", error);
      }
    }
    checkRecipeInBook();
  },[])


  // remove the recipe from the book
  const removeRecipeIdFromBook = async () => {
    try {
      const requestBody = {
        query: `
          mutation {
            deleteRecipeIdInBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
          }
        `
      };
      console.log(requestBody);
      const res = await fetch('http://localhost:3000/graphql', {
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
      console.log("remove successfully")
      setIsInBook(false);
    } catch(error) {
      console.log("remove recipe failed", error);
    }
  };

  // add recipe into the book
  const addRecipeIdToBook = async () => {
    try {
      const requestBody = {
        query: `
          mutation {
            addRecipeToBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
          }
        `
      };
      console.log(requestBody);
      const res = await fetch('http://localhost:3000/graphql', {
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
      console.log("add successfully")
      setIsInBook(true);
    } catch(error) {
      console.log("add to recipe failed", error);
    }

  };

  return (
    <FormControlLabel 
      control={<Checkbox checked={isInBook} onClick={()=> isInBook ? removeRecipeIdFromBook() : addRecipeIdToBook()}/>} 
      label={props.name} 
    />
  )
}

export default CheckItem;