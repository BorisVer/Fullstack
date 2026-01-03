require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const People = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

// Routes

// Get all people
app.get('/api/persons', (request, response, next) => {
  People.find({})
    .then(people => response.json(people))
    .catch(error => next(error))
})

// Info page
app.get('/info', (request, response, next) => {
  const date = new Date()
  People.find({})
    .then(people => {
      response.send(
        `Phonebook has info for ${people.length} people<br><br>${date}`
      )
    })
    .catch(error => next(error))
})

// Get single person
app.get('/api/persons/:id', (request, response, next) => {
  People.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Add a person
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({ error: 'No name or number' })
  }

  const person = new People({ name, number })
  person
    .save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

// Delete person
app.delete('/api/persons/:id', (request, response, next) => {
  People.deleteOne({ _id: request.params.id })
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

// MIDDLEWARE

// Unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// SERVER

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
