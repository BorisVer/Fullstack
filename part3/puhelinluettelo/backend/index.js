const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
];

const date = new Date();

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people<br><br>${date}`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    return response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 100000);
  const name = request.body.name;
  const number = request.body.number;
  if (!name || !number) {
    return response.status(400).json({ error: "name or number missing" });
  } else if (persons.some((p) => p.name === name)) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const person = { id, name, number };
  persons.push(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
