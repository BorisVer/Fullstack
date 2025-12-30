// ONLY COMMAND LINE

const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.jvu9pui.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((person) => {
    console.log("Phonebook info:");
    person.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`${name} has been added to the database`);
    mongoose.connection.close();
  });
}
