import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react'
import axios from 'axios';

function App() {
  //state hook for tracking clicks
  const [clickCount, setClickCount] = useState(0)
  const [geoData, setGeoData] = useState({})

  //function to get data from json
  const getCountData = () => {
    console.log('getting count data')
    axios.get('http://localhost:3001/countData').then(response => {
      console.log(response.data)
      setClickCount(response.data.count)
    })
  }

  const getGeoData = () => {
    console.log('getting geo data')
    axios.get('http://localhost:3001/geoData').then(response => {
      console.log(response.data)
      setGeoData(response.data)
    })
  }

  useEffect(getCountData, [clickCount])
  useEffect(getGeoData, [clickCount])

  //event handler for button clicks
  const handleClick = () => {
    setClickCount(clickCount + 1)
    //update server click count
    axios.post('http://localhost:3001/countData', {count: clickCount + 1})
    .then(response => {
      console.log(response.data)
    })
    navigator.geolocation.getCurrentPosition(async (position) => {
      const country = await getCountry(position.coords.latitude, position.coords.longitude)
      const posVal = geoData[country] ? geoData[country] + 1 : 1
      console.log("posVal",posVal)
      setGeoData({...geoData, [country]: posVal})
      console.log("geoData", geoData)
      axios.post('http://localhost:3001/geoData', {[country]: posVal})
      .then(response => {
        console.log("response", response.data)
      })
    })
  }

  async function getCountry(latitude, longitude) {
    const apiCall = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    const countryData = await apiCall.json();
    console.log(countryData)
    return countryData.countryName;
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          A nice spinning button. Click it and find out what happens.
        </h1>
        <button style={{background: 'transparent'}} onClick={handleClick}><img src={logo} className="App-logo" alt="logo" /></button>
        
        <p>Click count: {clickCount}</p>
        <p>See where other people who clicked the button are from:</p>
        <ul>
          {Object.keys(geoData).map((key, index) => (
            <li key={index}>{key}: {geoData[key]}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
