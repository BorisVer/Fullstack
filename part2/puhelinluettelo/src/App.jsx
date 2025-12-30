import { useState, useEffect } from "react";
import personServices from "./services/persons";
import Notification from "./components/notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personServices.getAll().then((initialPerson) => {
      setPersons(initialPerson);
    });
  }, []);

  const newNote = (event) => {
    event.preventDefault();

    console.log("clicked with value", newName);

    const existingPerson = persons.find((person) => person.name === newName);

    if (persons.some((person) => person.name === newName)) {
      const ok = window.confirm(
        `${newName} is already added. Do you want to update the number?`,
      );

      if (ok) {
        const updatePerson = { ...existingPerson, number: newNumber };

        personServices
          .update(existingPerson.id, updatePerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson,
              ),
            );
            setMessage({
              text: `Updated ${returnedPerson.name}`,
              type: "success",
            });
            setTimeout(() => setMessage(null), 5000);
            setNewName("");
            setNewNumber("");
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personServices
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setMessage({ text: `Added ${returnedPerson.name}`, type: "success" });
        setTimeout(() => setMessage(null), 5000);
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        setMessage({
          text: `${error.response.data.error}`,
          type: "error",
        });
        setTimeout(() => setMessage(null), 5000);
      });
  };

  const handleNoteChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };
  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    const ok = window.confirm(`Delete ${person.name}?`);
    if (ok) {
      setMessage({
        text: `User ${person.name} deleted`,
        type: "success",
      });
      setTimeout(() => setMessage(null), 5000);
      personServices
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
        })

        .catch(() => {
          setMessage({ text: `User ${person.name} not found`, type: "error" });
          setTimeout(() => setMessage(null), 5000);
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <form>
        <div>
          filter shown with
          <input value={newSearch} onChange={handleSearchChange} />
        </div>
      </form>
      <form onSubmit={newNote}>
        <div>
          <h2>Add New Contact</h2>
          name:
          <input value={newName} onChange={handleNoteChange} />
        </div>
        <div>
          number:
          <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Numbers
        persons={persons}
        search={newSearch}
        handleDelete={handleDelete}
      />
    </div>
  );
};

const Numbers = ({ persons, search, handleDelete }) => {
  return (
    <ul>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase()),
        )
        .map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </li>
        ))}
    </ul>
  );
};

export default App;
