import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react'
import axios from 'axios';

function App() {
  //state hook for tracking clicks
  const [clickCount, setClickCount] = useState(0)

  //function to get data from json
  const getCountData = () => {
    console.log('getting count data')
    axios.get('http://localhost:3001/countData').then(response => {
      console.log(response.data)
      setClickCount(response.data.count)
    })
  }

  useEffect(getCountData, [clickCount])

  //event handler for button clicks
  const handleClick = () => {
    setClickCount(clickCount + 1)
  }
  return (
    <div className="App">
      <header className="App-header">
        <button style={{background: 'transparent'}} onClick={handleClick}><img src={logo} className="App-logo" alt="logo" /></button>
        <p>
          A nice spinning button. Click it and find out what happens.
        </p>
        <p>Click count: {clickCount}</p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
