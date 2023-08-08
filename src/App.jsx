import { useState, useEffect } from "react";
import "./App.css";

function Highscore({ highscore }) {
  return (
    <p className="highscore">
      highscore <span style={{ color: "#fff" }}>{highscore}</span>
    </p>
  );
}

function Score({ score }) {
  return (
    <p className="score">
      <span style={{ color: "#fff" }}>{score}</span> your score
    </p>
  );
}

function Modal({ success, newHighscore, level }) {
  return (
    <>
      {level === 0 && (
        <div
          className="modal"
          style={{
            backgroundColor: "#000000cb",
            width: "100%",
            height: "100%",
            marginTop: "0",
            padding: "5vw",
          }}
        >
          <img
            src="./src/assets/instructions.png"
            style={{ width: "min(70vh, 70vw)", height: "min(70vh, 70vw)" }}
          ></img>
          <p style={{ fontSize: "min(max(4vh, 20px), max(4vw, 20px))" }}>
            Welcome to my little Rick and Morty memory card game. Try to click
            each memory card only once. Can you push the highscore to new
            heights?
          </p>
        </div>
      )}
      {success === true && (
        <div className="modal">
          <img
            src="./src/assets/success.png"
            style={{ width: "min(60vh, 60vw)", height: "min(60vh, 60vw)" }}
          ></img>
          <p style={{ fontSize: "min(max(4vh, 32px), max(4vw, 32px))" }}>
            You made it! But level {level} will be tougher...
          </p>
        </div>
      )}
      {success === false && (
        <div className="modal">
          <p style={{ fontSize: "min(max(5vh, 40px), max(5vw, 40px))" }}>
            Game over!
          </p>
          <img
            src="./src/assets/gameover.png"
            style={{ width: "min(50vh, 50vw)", height: "min(50vh, 50vw)" }}
          ></img>
          {newHighscore === true && (
            <p style={{ fontSize: "min(max(4vh, 32px), max(4vw, 32px))" }}>
              But hey, it's a new highscore!
            </p>
          )}
          <p style={{ fontSize: "min(max(4vh, 32px), max(4vw, 32px))" }}>
            Can you do even better?
          </p>
        </div>
      )}
    </>
  );
}

function Card({ level, numCol, character, onClick, fade }) {
  function handleClick() {
    return onClick(character.id);
  }

  let imgStyle;
  imgStyle = {
    width: `min(calc((100vh - var(--headersize)) * 0.75 / ${numCol} - 16px), calc(75vw / ${numCol} - 16px))`,
  };

  let cardStyle;
  if (fade === "in") {
    cardStyle = {
      opacity: "1",
      gridTemplateRows: `min(calc((100vh - var(--headersize)) * 0.75 / ${numCol} - 16px), calc(75vw / ${numCol}) - 16px) min(max(calc((100vh - var(--headersize)) * 0.75 / ${numCol} / 4 - 16px), 20px), max(calc(75vw / ${numCol} / 4 - 16px), 20px))`,
    };
  } else if (fade === "out") {
    cardStyle = {
      opacity: "0",
      gridTemplateRows: `min(calc((100vh - var(--headersize)) * 0.75 / ${numCol} - 16px), calc(75vw / ${numCol}) - 16px) min(max(calc((100vh - var(--headersize)) * 0.75 / ${numCol} / 4 - 16px), 20px), max(calc(75vw / ${numCol} / 4 - 16px), 20px))`,
    };
  } else {
    cardStyle = {
      gridTemplateRows: `min(calc((100vh - var(--headersize)) * 0.75 / ${numCol} - 16px), calc(75vw / ${numCol}) - 16px) min(max(calc((100vh - var(--headersize)) * 0.75 / ${numCol} / 4 - 16px), 20px), max(calc(75vw / ${numCol} / 4 - 16px), 20px))`,
    };
  }

  let divStyle;
  if (character.name.length < 17) {
    divStyle = {
      fontSize: `min(max(calc(((100vh - var(--headersize)) * 0.75 / ${numCol} / 4 - 16px) * 0.5), calc(20px * 0.3)), max(calc((75vw / ${numCol} / 4 - 16px) * 0.5), calc(20px * 0.3)))`,
    };
  } else if (character.name.length < 29) {
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

function Gameboard({ level, characters, onClick, fade }) {
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
        fade={fade}
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
  const [fade, setFade] = useState("in");
  const [success, setSuccess] = useState(true);
  const [modal, setModal] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const [level, setLevel] = useState(0);
  const levels = [4, 9, 16, 25, 36, 49, 0];
  let numCharacters = levels[level];

  function getRandomDataset(count) {
    let ids = [];
    let guardian = new Set();
    while (ids.length < count) {
      const randomId = Math.floor(Math.random() * 826);
      if (
        guardian.has(randomId) ||
        randomId === 19 ||
        randomId === 66 ||
        randomId === 189 ||
        randomId === 249
      ) {
        continue;
      }
      guardian.add(randomId);
      ids.push(randomId);
    }
    ids.sort((a, b) => a - b);
    return ids;
  }

  function shuffleCards() {
    let characterInfos = [];
    let guardian = new Set();
    while (characterInfos.length < numCharacters) {
      const randomId = Math.floor(Math.random() * numCharacters);
      if (guardian.has(randomId)) {
        continue;
      }
      const element = data[randomId];
      guardian.add(randomId);
      characterInfos.push(element);
    }
    return characterInfos;
  }

  async function getData(receivedData) {
    setFade("out");
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (guessed.includes(receivedData)) {
      if (score > highscore) setHighscore(score);
      setLevel(levels.length - 1);
      await betweenLevels(false);
      setScore(0);
      nextLevel(0);
    } else {
      guessCorrect(receivedData);
      if (available.length !== 1) {
        nextRound();
      } else {
        nextLevel(level + 1);
      }
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
    let newCards = characters;
    while (newCards === characters) {
      newCards = shuffleCards();
    }
    setCharacters(newCards);
  }

  async function betweenLevels(success) {
    setSuccess(success);
    setModal(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setModal(false);
    return;
  }

  async function nextLevel(newLevel) {
    if (newLevel > 0) await betweenLevels(true);
    setLevel(newLevel);
  }

  async function startup(msec) {
    await new Promise((resolve) => setTimeout(resolve, msec));
    setStartGame(true);
  }

  startup(8000);

  useEffect(() => {
    if (numCharacters > 0) {
      const dataset = getRandomDataset(numCharacters);
      const fetchData = async () => {
        const response = await fetch(url + `${dataset}`);
        const apiData = await response.json();
        setData(apiData);
      };
      fetchData();
    }
  }, [numCharacters]);

  useEffect(() => {
    const reloadGameboard = () => {
      setCharacters(data);
      setAvailable(data);
      setGuessed([]);
      setIsBusy(false);
    };
    reloadGameboard();
  }, [data]);

  useEffect(() => {
    setFade("in");
    setSuccess(true);
  }, [characters]);

  return (
    <>
      <div className="header">
        <Highscore highscore={highscore} />
        <h1>Rick and Morty</h1>
        <h2>Memory Card Game</h2>
        <Score score={score} />
      </div>
      {!startGame && <Modal level={0} />}
      {!isBusy && (
        <Gameboard
          level={level}
          characters={characters}
          onClick={getData}
          fade={fade}
        />
      )}
      {modal && (
        <Modal
          success={success}
          level={level + 2}
          newHighscore={score >= highscore}
        />
      )}
    </>
  );
}

export default App;
