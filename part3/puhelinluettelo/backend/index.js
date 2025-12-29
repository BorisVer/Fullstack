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
  People.find({}).then((people) => {
    response.json(people);
  });
});

// Info about the website
app.get("/info", (request, response) => {
  const date = new Date();
  People.find({}).then((people) => {
    response.send(
      `Phonebook has info for ${people.length} people<br><br>${date}`,
    );
  });
});

// Search a single person
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  People.findById(id).then((person) => {
    response.json(person);
  });
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

  person.save().then((saved) => {
    response.json(saved);
  });
});

// Delete user from button next to name
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  People.findByIdAndRemove(id).then(() => {
    response.status(204).end();
  });
});

app.use(express.static("dist"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
