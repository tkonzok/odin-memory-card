import { useState, useEffect } from "react";
import "./App.css";

function Highscore({ highscore }) {
  return <p className="highscore">Highscore: {highscore}</p>;
}

function Score({ score }) {
  return <p className="score">Your score: {score}</p>;
}

function Card({ level, characters, character, onClick }) {
  function handleClick() {
    return onClick(character.id);
  }

  let imgStyle;
  if (characters.length < 10) {
    imgStyle = {
      width: "calc((100vh - var(--headersize)) / 5 * 4.5 / 5)",
    };
  } else if (characters.length < 17) {
    imgStyle = {
      width: "calc((100vh - var(--headersize)) / 6 * 4.5 / 5)",
    };
  } else if (characters.length < 21) {
    imgStyle = {
      width: "calc((100vh - var(--headersize)) / 7 * 4 / 5)",
    };
  } else if (characters.length < 31) {
    imgStyle = {
      width: "calc((100vh - var(--headersize)) / 8 * 4 / 5)",
    };
  } else {
    imgStyle = {
      width: "calc((100vh - var(--headersize)) / 10 * 4 / 5)",
    };
  }

  return (
    <button key={character.id} className="card" onClick={handleClick}>
      <img src={character.image} style={imgStyle}></img>
      {level < 4 && <div>{character.name}</div>}
      {level >= 4 && <div className="name-hidden">hidden</div>}
    </button>
  );
}

function Gameboard({ level, characters, onClick }) {
  let cards = [];
  for (const character of characters) {
    cards.push(
      <Card
        key={character.id}
        character={character}
        level={level}
        onClick={onClick}
        characters={characters}
      />
    );
  }

  let gameboardStyle;
  if (characters.length < 10) {
    gameboardStyle = {
      gridTemplateColumns: "repeat(3, calc((100vh - var(--headersize)) / 5))",
    };
  } else if (characters.length < 13) {
    gameboardStyle = {
      gridTemplateColumns: "repeat(3, calc((100vh - var(--headersize)) / 6))",
    };
  } else if (characters.length < 17) {
    gameboardStyle = {
      gridTemplateColumns: "repeat(4, calc((100vh - var(--headersize)) / 6))",
    };
  } else if (characters.length < 21) {
    gameboardStyle = {
      gridTemplateColumns: "repeat(4, calc((100vh - var(--headersize)) / 7))",
    };
  } else if (characters.length < 31) {
    gameboardStyle = {
      gridTemplateColumns: "repeat(5, calc((100vh - var(--headersize)) / 8))",
    };
  } else if (characters.length < 37) {
    gameboardStyle = {
      gridTemplateColumns: "repeat(6, calc((100vh - var(--headersize)) / 10))",
    };
  } else {
    gameboardStyle = {
      gridTemplateColumns: "repeat(7, calc((100vh - var(--headersize)) / 10))",
    };
  }

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
  const levels = [3, 6, 9, 12, 16, 20, 25, 30, 36, 49];
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
