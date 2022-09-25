import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Nav from './components/Nav';
import Login from './pages/Login';
import Main from './pages/Main';


const App = () => {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
