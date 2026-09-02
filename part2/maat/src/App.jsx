import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('countries fetched:', response.data)
        setCountries(response.data)
      })
  }, [])

  const handleChange = event => {
    setValue(event.target.value)
  }

  const countriesShow = countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase()))

  return (
    <div>
      <div>
        find countries <input value={value} onChange={handleChange} />
      </div>
      <div>
        <CountryList countries={countriesShow} onSelect={setValue} />
      </div>
    </div>
  )
}


const CountryList = ({ countries, onSelect }) => {
  if (countries.length > 10) {
    return <div>Too much</div>
  }

  if (countries.length > 1) {
    return(
      <div>
        {countries.map(country => (
          <div key={country.name.common}>
            {country.name.common} <button onClick={() => onSelect(country.name.common)}>Show</button>
          </div>
        ))}
      </div>
    )
  }

  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} />

        <Weather capital={country.capital[0]} />
      </div>
    )
  }

  return (
    <div>
      No matches
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    const api_key = import.meta.env.VITE_WEATHER_KEY
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [capital])

  if (!weather) {
    return <div>Loading...</div>
  }

  return (
      <div>
        <h2>Weather in {capital}</h2>
        <div>Temperature {weather.main.temp} Celsius</div>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
        <div>Wind {weather.wind.speed} m/s</div>
      </div>
    )
}


export default App
