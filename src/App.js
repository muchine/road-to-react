import React, { Component } from 'react';
import './App.css';

class  App extends Component {
  render() {
    const message = 'Welcome to the Road to learn React!!';
    const user = {
      first: 'Sejoon',
      last: 'Lim'
    };

    return (
        <div className="App">
          <h2>{message}</h2>
          <h5>Hello, {user.first} {user.last}</h5>
        </div>
    );
  }
}

export default App;
