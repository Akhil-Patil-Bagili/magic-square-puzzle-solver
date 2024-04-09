import React, { useState, useEffect } from 'react';
import DraggableNumber from './DraggableNumber';
import DroppableCell from './DroppableCell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';

export const PuzzleBoard = () => {
  // const initialNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [puzzle, setPuzzle] = useState(Array(9).fill(null));
  let [availableNumbers, setAvailableNumbers] = useState([]);

  useEffect(() => {
    fetchNumbers();
  }, []);

  const fetchNumbers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/puzzle/generate?level=${level}");
      setAvailableNumbers(response.data.numbers);
    } catch (error) {
      console.error("Error fetching new numbers:", error);
      alert("Error fetching new numbers. Please try again.");
    }
  };

  const handleDrop = (cellId, droppedNumber) => {
    let newPuzzle = puzzle;
    let temp = 0

    if(newPuzzle[cellId] === null)
    {
      newPuzzle[cellId] = droppedNumber;
      availableNumbers = availableNumbers.filter(num => num !== droppedNumber);
      setAvailableNumbers(availableNumbers);
    }
    else{
        temp = newPuzzle[cellId];
        newPuzzle[cellId] = droppedNumber;
        console.log(droppedNumber);
        availableNumbers = availableNumbers.filter(num => num !== droppedNumber).concat(temp).sort((a, b) => a - b); 
        setAvailableNumbers(availableNumbers);
    }

    setPuzzle(newPuzzle);  
  };

  const submitPuzzle = async () => {
    const matrix = [
      puzzle.slice(0, 3),
      puzzle.slice(3, 6),
      puzzle.slice(6, 9)
    ];

    try {
      const response = await axios.post(API_ENDPOINTS.check, { matrix });
      alert(response.data.message);
    } catch (error) {
      alert("Error submitting the puzzle. Please try again.");
      console.error("Error submitting the puzzle:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen items-start justify-center pt-16">
        <div className="grid grid-cols-3 gap-2">
          {puzzle.map((number, index) => (
            <DroppableCell key={index} cellId={index} onDrop={handleDrop}>
              {number !== null && <DraggableNumber id={number} number={number} />}
            </DroppableCell>
          ))}
        </div>
        <div className="flex flex-col mt-16">
          <div className="flex flex-wrap justify-center gap-2 ml-12 max-w-xs">
            {availableNumbers.map((number) => (
              puzzle.indexOf(number) === -1 && <DraggableNumber key={number} id={number} number={number} />
            ))}
          </div>
          <div className="mt-16 ml-14 pb-2 text-center">
            <button onClick={submitPuzzle} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Check</button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};