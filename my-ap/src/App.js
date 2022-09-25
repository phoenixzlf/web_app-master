import React, { Fragment, useEffect } from 'react';
import './App.css';
import Home from '../../my-ap/src/components/Home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Article from './components/Article';
const App=()=> {
  return (
    <div className="App">
      <Router>
      <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/Article' component={Article} />
      </Switch>
      
      </Router>
    </div>
  );
}

export default App;
