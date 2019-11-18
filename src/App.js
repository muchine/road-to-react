import React, { Component } from 'react';
import './App.css';

class  App extends Component {
  render() {
    let message = 'Welcome to the Road to learn React!!';
    return (
        <div className="App">
          <h2>{message}</h2>
        </div>
    );
  }
}

export default App;
