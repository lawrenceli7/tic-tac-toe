import { useState } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameInfo = styled.div`
  margin-top: 20px;
`;

const BoardRow = styled.div`
  display: flex;
`;

const SquareButton = styled.button`
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 100px;
  width: 100px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  cursor: pointer;
  color: ${({ value }) => (value === 'X' ? 'red' : value === 'O' ? 'green' : 'black')};

  &:focus {
    outline: none;
  }

  &:hover {
    background: #ddd;
  }
`;

const Status = styled.div`
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
`;

const MoveList = styled.ol`
  padding-left: 30px;
`;

const MoveButton = styled.button`
  margin-bottom: 5px;
  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

function Square({ value, onSquareClick }) {
  return (
    <SquareButton value={value} onClick={onSquareClick}>
      {value}
    </SquareButton>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <Status>{status}</Status>
      <BoardRow>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </BoardRow>
      <BoardRow>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </BoardRow>
      <BoardRow>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </BoardRow>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <MoveButton onClick={() => jumpTo(move)}>{description}</MoveButton>
      </li>
    );
  });

  return (
    <GameContainer>
      <GameBoard>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </GameBoard>
      <GameInfo>
        <MoveList>{moves}</MoveList>
      </GameInfo>
    </GameContainer>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}