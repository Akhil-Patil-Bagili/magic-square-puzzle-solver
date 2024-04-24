import React, { useState, useEffect } from 'react';
import DraggableNumber from './DraggableNumber';
import DroppableCell from './DroppableCell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';
import { ButtonDark } from './ButtonDark';
import { ButtonLight } from './ButtonLight';

export const PuzzleBoard = ({ difficulty, magicSum, partialSolution }) => {
    const [puzzle, setPuzzle] = useState(Array(9).fill(null));
    const [availableNumbers, setAvailableNumbers] = useState([]);

    const fetchNumbers = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.puzzleGenerate}?level=${difficulty}`);
            const numbers = response.data.numbers;
            setAvailableNumbers(numbers.flat()); // Flatten the array to store individual numbers
        } catch (error) {
            console.error("Error fetching new numbers:", error);
            alert("Error fetching new numbers. Please try again.");
        }
    };

    useEffect(() => {
        fetchNumbers();
    }, [difficulty]);

    useEffect(() => {
        if (partialSolution && partialSolution.length > 0) {
            setPuzzle(partialSolution);
        }
    }, [partialSolution]);

    const handleDrop = (cellId, droppedNumber) => {
        setPuzzle(prevPuzzle => {
            const newPuzzle = [...prevPuzzle];
            const originalIndex = prevPuzzle.findIndex(num => num === droppedNumber);
            const isFromAvailable = originalIndex === -1;

            if (isFromAvailable) {
                if (newPuzzle[cellId] !== null) {
                    setAvailableNumbers(prevAvailable => [...prevAvailable, newPuzzle[cellId]]);
                }
                newPuzzle[cellId] = droppedNumber;
                setAvailableNumbers(prevAvailable => prevAvailable.filter(num => num !== droppedNumber));
            } else {
                if (originalIndex !== cellId) {
                    const targetNumber = newPuzzle[cellId];
                    newPuzzle[originalIndex] = targetNumber;
                    newPuzzle[cellId] = droppedNumber;
                }
            }
            return newPuzzle;
        });
    };

    const handleRemove = (cellId) => {
        setPuzzle(prevPuzzle => {
            const newPuzzle = [...prevPuzzle];
            const numberToRemove = newPuzzle[cellId];
            newPuzzle[cellId] = null;
            if (numberToRemove !== null) {
                setAvailableNumbers(prevAvailableNumbers => [...new Set([...prevAvailableNumbers, numberToRemove])].sort((a, b) => a - b));
            }
            return newPuzzle;
        });
    };

    const handleClear = () => {
        setPuzzle(Array(9).fill(null));
        fetchNumbers();
    };

    const revealSolution = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.solution}?level=${difficulty}`);
            if (response.status === 200) {
                const res = response.data.solution
                setPuzzle(res.flat());
                setAvailableNumbers([]);  // Clear available numbers since the puzzle is solved
            } else {
                throw new Error('Failed to fetch the solution');
            }
        } catch (error) {
            console.error("Error fetching the solution:", error);
            alert("Error fetching the solution. Please try again.");
        }
    };

    const submitPuzzle = async () => {
        const matrix = [puzzle.slice(0, 3), puzzle.slice(3, 6), puzzle.slice(6, 9)];
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
            <div className="flex h-screen items-start justify-center pt-4">
                <div className="grid grid-cols-3 gap-2">
                    {puzzle.map((number, index) => (
                        <DroppableCell key={index} cellId={index} onDrop={handleDrop} onRemove={() => handleRemove(index)}>
                            {number !== null && (
                                <DraggableNumber
                                    id={number}
                                    number={number}
                                    onRemove={() => handleRemove(index)}
                                />
                            )}
                        </DroppableCell>
                    ))}
                </div>
                <div className="flex flex-col mt-16">
                    <div className="flex flex-wrap justify-center gap-2 ml-12 max-w-xs">
                        {availableNumbers.map((number) => (
                            <DraggableNumber key={number} id={number} number={number} />
                        ))}
                    </div>
                    <div className="mt-16 ml-14 pb-2 text-center flex flex-col items-center">
                        <div className="flex justify-center w-full mb-4">
                            <ButtonLight onClick={submitPuzzle} label="Submit"/>
                            <ButtonLight onClick={handleClear} label="Clear" style={{ marginLeft: '20px' }}/>
                        </div>
                        <div className="flex justify-center w-full">
                          {magicSum !== null && (
                                  <div className="text-lg font-bold">Magic Sum: {magicSum}</div>
                              )}
                            <ButtonDark onClick={revealSolution} label="Reveal Solution"/>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};
