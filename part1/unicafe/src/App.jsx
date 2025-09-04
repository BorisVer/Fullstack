import React, { useState } from "react";

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Stat = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{text === "Positive" ? `${value}%` : value}</td>
    </tr>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Unicafe Feedback</h1>
      <div>
        <Button
          text="Good"
          onClick={() => {
            setGood(good + 1);
            console.log("Pressed button: Good");
          }}
        />
        <Button
          text="Neutral"
          onClick={() => {
            setNeutral(neutral + 1);
            console.log("Pressed button: Neutral");
          }}
        />
        <Button
          text="Bad"
          onClick={() => {
            setBad(bad + 1);
            console.log("Pressed button: Bad");
          }}
        />
      </div>
      <div>
        <h2>Statistics</h2>
        {good + neutral + bad === 0 ? (
          <div>No feedback given</div>
        ) : (
          <table>
            <tbody>
              <Stat text="Good" value={good} />
              <Stat text="Neutral" value={neutral} />
              <Stat text="Bad" value={bad} />
              <Stat text="All" value={good + neutral + bad} />
              <Stat
                text="Avarage"
                value={(good - bad) / (good + neutral + bad)}
              />
              <Stat
                text="Positive"
                value={(good / (good + neutral + bad)) * 100}
              />
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default App;
