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
        <CountryList countries={countriesShow} />
      </div>
    </div>
  )
}


const CountryList = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too much</div>
  }

  if (countries.length > 1) {
    return(
      <div>
        {countries.map(country => (
          <div key={country.name.common}>
            {country.name.common}
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
        <img src={country.flags.png}/>
      </div>
    )
  }

  return (
    <div>
      No matches
    </div>
  )
}




export default App
