import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './vue/navbar';
import Home from './vue/home';
import Global from './vue/global';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/global" element={<Global />} />
      </Routes>
    </Router>
  );
}

export default App;