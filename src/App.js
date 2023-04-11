import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react'
//import axios from 'axios';

function App() {
  //state hook for tracking clicks
  const [clickCount, setClickCount] = useState(0)
  const [geoData, setGeoData] = useState({})

  //function to get data from json
  const getCountData = () => {
    console.log('getting count data')
    /* In an ideal world, this would be the code to get the data from the server
    Sadly vercel insists on fighting us, so we're just going to get the data from local storage instead
    This applies to all the other commented out axios code in this file
    axios.get('http://localhost:3001/countData').then(response => {
      console.log(response.data)
      setClickCount(response.data.count)
    })
    */
    const countData = localStorage.getItem('clickCount')
    const actualCountData = countData ? parseInt(countData) : 0
    setClickCount(actualCountData)
  }

  const getGeoData = () => {
    console.log('getting geo data')
    /*
    axios.get('http://localhost:3001/geoData').then(response => {
      console.log(response.data)
      setGeoData(response.data)
    })
    */
    const storedGeoData = localStorage.getItem('geoData')
    const actualGeoData = storedGeoData ? JSON.parse(storedGeoData) : {}
    setGeoData(actualGeoData)
  }

  useEffect(getCountData, [clickCount])
  useEffect(getGeoData, [clickCount])

  //event handler for button clicks
  const handleClick = () => {
    setClickCount(clickCount + 1)
    //update server click count
    /*
    axios.post('http://localhost:3001/countData', {count: clickCount + 1})
    .then(response => {
      console.log(response.data)
    })
    */
   localStorage.setItem('clickCount', clickCount + 1)
    navigator.geolocation.getCurrentPosition(async (position) => {
      const country = await getCountry(position.coords.latitude, position.coords.longitude)
      const posVal = geoData[country] ? geoData[country] + 1 : 1
      console.log("posVal",posVal)
      setGeoData({...geoData, [country]: posVal})
      console.log("geoData", geoData)
      /*
      axios.post('http://localhost:3001/geoData', {[country]: posVal})
      .then(response => {
        console.log("response", response.data)
      })
      */
     localStorage.setItem('geoData', JSON.stringify({...geoData, [country]: posVal}))
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
