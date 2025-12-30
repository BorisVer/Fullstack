require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const People = require("./models/person");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Get all people
app.get("/api/persons", (request, response) => {
  People.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => next(error));
});

// Info about the website
app.get("/info", (request, response) => {
  const date = new Date();
  People.find({})
    .then((people) => {
      response.send(
        `Phonebook has info for ${people.length} people<br><br>${date}`,
      );
    })
    .catch((error) => next(error));
});

// Search a single person
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  People.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Add a person from the text fields
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "No name or number" });
  }

  const person = new People({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((saved) => {
      response.json(saved);
    })
    .catch((error) => next(error));
});

// Delete user from button next to name
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  console.log(`Deleting person with id ${id}`);
  People.deleteOne({ _id: id })
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Error
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ eroor: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);

app.use(express.static("dist"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
