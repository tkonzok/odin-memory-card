import { useState, useEffect } from "react";
import "./App.css";

function Highscore({ highscore }) {
  return <p className="highscore">Highscore: {highscore}</p>;
}

function Score({ score }) {
  return <p className="score">Your score: {score}</p>;
}

function Card({ level, numCol, character, onClick }) {
  function handleClick() {
    return onClick(character.id);
  }

  let imgStyle;
  imgStyle = {
    width: `min(calc((100vh - var(--headersize)) * 0.75 / ${numCol} - 16px), calc(75vw / ${numCol} - 16px))`,
  };

  let cardStyle;
  cardStyle = {
    gridTemplateRows: `min(calc((100vh - var(--headersize)) * 0.75 / ${numCol} - 16px), calc(75vw / ${numCol}) - 16px) min(max(calc((100vh - var(--headersize)) * 0.75 / ${numCol} / 4 - 16px), 20px), max(calc(75vw / ${numCol} / 4 - 16px), 20px))`,
  };

  let divStyle;
  if (character.name.length < 17) {
    divStyle = {
      fontSize: `min(max(calc(((100vh - var(--headersize)) * 0.75 / ${numCol} / 4 - 16px) * 0.5), calc(20px * 0.3)), max(calc((75vw / ${numCol} / 4 - 16px) * 0.5), calc(20px * 0.3)))`,
    };
  } else if (character.name.length < 33) {
    divStyle = {
      fontSize: `min(max(calc(((100vh - var(--headersize)) * 0.75 / ${numCol} / 4 - 16px) * 0.4), calc(20px * 0.25)), max(calc((75vw / ${numCol} / 4 - 16px) * 0.4), calc(20px * 0.25)))`,
    };
  } else {
    divStyle = {
      fontSize: `min(max(calc(((100vh - var(--headersize)) * 0.75 / ${numCol} / 4 - 16px) * 0.3), calc(20px * 0.2)), max(calc((75vw / ${numCol} / 4 - 16px) * 0.3), calc(20px * 0.2)))`,
    };
  }

  return (
    <button
      key={character.id}
      className="card"
      style={cardStyle}
      onClick={handleClick}
    >
      <img src={character.image} style={imgStyle}></img>
      {level < 7 && <div style={divStyle}>{character.name}</div>}
      {level >= 7 && <div className="name-hidden">hidden</div>}
    </button>
  );
}

function Gameboard({ level, characters, onClick }) {
  let cards = [];
  let numCol = Math.ceil(Math.sqrt(characters.length));

  for (const character of characters) {
    cards.push(
      <Card
        key={character.id}
        character={character}
        level={level}
        onClick={onClick}
        numCol={numCol}
      />
    );
  }

  let gameboardStyle;

  gameboardStyle = {
    gridTemplateColumns: `repeat(${numCol}, min(calc((100vh - var(--headersize)) * 0.75 / ${numCol}), calc(75vw / ${numCol}))`,
  };

  return (
    <div className="gameboard" style={gameboardStyle}>
      {cards}
    </div>
  );
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

  const [level, setLevel] = useState(0);
  const levels = [4, 9, 16, 25, 36, 49];
  let numCharacters = levels[level];

  function getRandomDataset(count) {
    let ids = [];
    let guardian = new Set();
    while (ids.length < count) {
      const randomId = Math.floor(Math.random() * 826);
      if (guardian.has(randomId) || randomId === 19 || randomId === 249) {
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
    while (characterInfos.length < numCharacters) {
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
    if (guessed.includes(receivedData)) {
      setHighscore(score);
      console.log("Game Over!");
      nextLevel(0);
    } else {
      guessCorrect(receivedData);
    }
    console.log(available);
    if (available.length !== 1) {
      nextRound();
    } else {
      nextLevel(level + 1);
    }
  }

  function guessCorrect(receivedData) {
    setGuessed([...guessed, receivedData]);
    setAvailable(
      available.filter((character) => character.id !== receivedData)
    );
    setScore(score + 1);
  }

  function nextRound() {
    const newCards = fetchCards();
    setCharacters(newCards);
  }

  function nextLevel(newLevel) {
    setLevel(newLevel);
    setIsBusy(true);
  }

  useEffect(() => {
    const dataset = getRandomDataset(numCharacters);
    const fetchData = async () => {
      const response = await fetch(url + `${dataset}`);
      const apiData = await response.json();
      setData(apiData);
    };
    fetchData();
  }, [numCharacters]);

  useEffect(() => {
    const reloadGameboard = () => {
      setCharacters(data);
      setAvailable(data);
      setIsBusy(false);
    };
    reloadGameboard();
  }, [data]);

  return (
    <>
      <div className="header">
        <Highscore highscore={highscore} />
        <h1>Rick and Morty</h1>
        <h2>Memory Card Game</h2>
        <Score score={score} />
      </div>
      {!isBusy && (
        <Gameboard level={level} characters={characters} onClick={getData} />
      )}
    </>
  );
}

export default App;
