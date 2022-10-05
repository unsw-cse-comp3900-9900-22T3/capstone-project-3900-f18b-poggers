import logo from "./logo.svg";
import "./App.css";
import Amplify, { API, Auth, Storage } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";
// import the API & graphqlOperation helpers as well as the query
import { graphqlOperation } from "aws-amplify";
import { listRecipes } from "./graphql/queries";
import { getRecipe } from "./graphql/queries";
import React, { useState } from "react";

// configure amplify
// this can be added in index.js as well
Amplify.configure(awsconfig);
Auth.configure(awsconfig);

function App() {
  const [data, setData] = React.useState({});

  //const onerecipe = await API.graphql({
  //query: getRecipe,
  //variables: { id: 'd826d6b6-449f-4d78-8eab-04b2dcd22b1a' }
  //});
  React.useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const apiData = await API.graphql({ query: listRecipes });
      const recipes = apiData.data.listRecipes.items;
      console.log("list", recipes[0].fileImage);
      const fileAccessURL = await Storage.get('puppy.png', { expires: 30 ,level: "public"});
      
      console.log(fileAccessURL);
      // const storageResult = await Storage.put('puppy.png', file, {
      //   level: 'public',
      //   type: 'image/png'
      // })
      setRecipes(recipes);
    } catch (error) {
      console.log("error on fetching recipe", error);
    }
  };

  // async function addTodo() {
  //   try {
  //     if (!formState.name || !formState.description) return
  //     const todo = { ...formState }
  //     setTodos([...todos, todo])
  //     setFormState(initialState)
  //     await API.graphql(graphqlOperation(createTodo, {input: todo}))
  //   } catch (err) {
  //     console.log('error creating todo:', err)
  //   }
  // }

  const { signOut, user } = useAuthenticator();
  const [selectedImage, setSelectedImage] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const newRecipe = {
    name: "RecipeXXX",
    content: "something here",
    contributor: user.attributes.email,
    fileImage: "",
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input placeholder="Cotent" />
        <input placeholder="Name" />
        <button style={styles.button}>Add recipe</button>
        <div style={styles.container}>
          {recipes.map((todo, index) => (
            <div key={todo.id ? todo.id : index} style={styles.todo}>
              <p style={styles.todoName}>{todo.name}</p>
              <p style={styles.todoDescription}>{todo.content}</p>
            </div>
          ))}
        </div>
        <button
          onClick={async () => {
            const storageResult = await Storage.put("puppy.png", selectedImage, {
              level: "public",
              type: "image/png",
            });
            // Insert predictions code here later
            console.log(storageResult);
          }}
        >
          Upload and check if there's a dog!
        </button>
        <div>
          <h1>Upload and Display Image usign React Hook's</h1>
          {selectedImage && (
            <div>
              <img
                alt="not fount"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
              />
              <br />
              <button onClick={() => setSelectedImage(null)}>Remove</button>
            </div>
          )}
          <br />

          <br />
          <input
            type="file"
            name="myImage"
            onChange={(event) => {
              console.log(event.target.files[0]);
              setSelectedImage(event.target.files[0]);
            }}
          />
        </div>
        <button onClick={() => signOut()}>Log Out</button>
      </header>
    </div>
  );
}
const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};
export default withAuthenticator(App);
