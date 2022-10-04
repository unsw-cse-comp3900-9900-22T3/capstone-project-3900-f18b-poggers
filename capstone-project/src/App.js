import logo from './logo.svg';
import './App.css';
import Amplify, {API, Auth} from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css';
import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
// import the API & graphqlOperation helpers as well as the query
import { graphqlOperation } from 'aws-amplify'
import { listRecipes } from './graphql/queries'
import React from 'react'

// configure amplify
// this can be added in index.js as well
Amplify.configure(awsconfig);
Auth.configure(awsconfig);



function App() {

  const [data, setData] = React.useState({})

  React.useEffect(() => {
      async function fetchMyAPI() {
        const apiData = await API.graphql({ query: listRecipes });
        setData(apiData)
        console.log(apiData)
      }

      fetchMyAPI()
    }, [])

  const { signOut } = useAuthenticator()

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => signOut()}>Log Out</button>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
