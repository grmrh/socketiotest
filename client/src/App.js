import React, { Component } from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    endpoint: "http://localhost:3001",
    response: false
  }

  componentDidMount() {
    const socket = io(this.state.endpoint);
    socket.on("REPLY_CREATE", data => this.setState({ response: data }));
    socket.emit('REQUEST_CREATE', 'Client fired');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Socket.IO with React</h1>
        </header>
        <div style={{textAlign: "center"}}>
          {this.state.response 
            ? <p className="App-intro">
                Server response is: {this.state.response}
              </p>
            : <p>Loading...</p>
           }
        </div>
      </div>
    );
  }
}

export default App;
