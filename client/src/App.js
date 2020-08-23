import React from 'react';
import logo from './logo.svg';
import Header from './Header'
import Start from './Start'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import RegisterComponent from './RegisterComponent'
import Home from './Home'
import './App.css';


function App() {
  return <div className="App">
    <Header />
    <Router>
      <Route path={'/register/:id/:token'} component={RegisterComponent} />
      <Route path={'/app'} component={Start} />
      <Route path={'/'} exact component={Home} />
    </Router>
  </div>
}

export default App;