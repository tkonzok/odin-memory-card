import { useState, useEffect } from "react";
import "./App.css";

function Highscore({ highscore }) {
  return <p className="highscore">Highscore: {highscore}</p>;
}

function Score({ score }) {
  return <p className="score">Your score: {score}</p>;
}

function Card({ character, onClick }) {
  function handleClick() {
    return onClick(character.id);
  }

  return (
    <button key={character.id} className="card" onClick={handleClick}>
      <img src={character.image} width="250px"></img>
      <div>{character.name}</div>
    </button>
  );
}

function Gameboard({ characters, onClick }) {
  let cards = [];
  for (const character of characters) {
    cards.push(
      <Card key={character.id} character={character} onClick={onClick} />
    );
  }

  return <div className="gameboard">{cards}</div>;
}

function App() {
  const url = "https://rickandmortyapi.com/api/character/";

  const [isBusy, setIsBusy] = useState(true);
  const [highscore, setHighscore] = useState(0);
  const [score, setScore] = useState(0);
  const [data, setData] = useState([]);
  const [available, setAvailable] = useState([]);
  const [guessed, setGuessed] = useState([]);
  const [characters, setCharacters] = useState([]);

  function getRandomDataset(count = 32) {
    let ids = [];
    let guardian = new Set();
    while (ids.length < count) {
      const randomId = Math.floor(Math.random() * 826);
      if (guardian.has(randomId)) {
        continue;
      }
      guardian.add(randomId);
      ids.push(randomId);
    }
    ids.sort((a, b) => a - b);
    return ids;
  }

  function fetchCards() {
    let characterInfos = [];
    let guardian = new Set();
    while (characterInfos.length < 8) {
      const randomId = Math.floor(Math.random() * data.length);
      if (guardian.has(randomId)) {
        continue;
      }
      if (guessed.includes(randomId)) {
        continue;
      }
      const element = data[randomId];
      guardian.add(randomId);
      characterInfos.push(element);
    }
    return characterInfos;
  }

  function getData(receivedData) {
    if (!guessed.includes(receivedData)) {
      setGuessed([...guessed, receivedData]);
      setAvailable(
        available.filter((character) => character.id !== receivedData)
      );
      setScore(score + 1);
      nextRound();
    } else {
      setHighscore(score);
      console.log("Game Over!");
    }
  }

  function nextRound() {
    const newCards = fetchCards();
    setCharacters(newCards);
  }

  useEffect(() => {
    const dataset = getRandomDataset();
    const fetchData = async () => {
      const response = await fetch(url + `${dataset}`);
      const apiData = await response.json();
      setData(apiData);
    };
    fetchData();
  }, []);

  if (data.length > 0 && characters.length < 1) {
    setCharacters(fetchCards());
    setIsBusy(false);
  }

  return (
    <>
      <div className="header">
        <Highscore highscore={highscore} />
        <h1>Rick and Morty</h1>
        <h2>Memory Card Game</h2>
        <Score score={score} />
      </div>
      {!isBusy && <Gameboard characters={characters} onClick={getData} />}
    </>
  );
}

export default App;
