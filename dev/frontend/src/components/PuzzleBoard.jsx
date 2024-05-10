import React, { useState, useEffect } from 'react';
import DraggableNumber from './DraggableNumber';
import DroppableCell from './DroppableCell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';
import { ButtonDark } from './ButtonDark';
import { ButtonLight } from './ButtonLight';
import Modal from './Modal'; // Import the Modal component

export const PuzzleBoard = ({ difficulty, magicSum, partialSolution, isModalOpen, setIsModalOpen, resetPartialSolutionFetched }) => {
    const initialGridSize = difficulty === 3 ? 16 : 9;
    const [puzzle, setPuzzle] = useState(Array(9).fill(null));
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showMagicSum, setShowMagicSum] = useState(false);


    useEffect(() => {
        if (magicSum !== null) {
            setShowMagicSum(true);
            setIsModalOpen(true);
        }
    }, [magicSum, setIsModalOpen]);

    const closeModal = () => {
        setIsModalOpen(false);
        setShowMagicSum(false);
    };

    const fetchNumbers = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.puzzleGenerate}?level=${difficulty}`);
            const numbers = response.data.numbers;
            const size = response.data.size * response.data.size;
            setPuzzle(Array(size).fill(null)); // Reset the puzzle with the correct size
            setAvailableNumbers(numbers.flat());
        } catch (error) {
            setModalMessage("Error fetching new numbers. Please try again.");
            setIsError(true);
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        fetchNumbers();
    }, [difficulty]);

    useEffect(() => {
        if (partialSolution && partialSolution.length > 0) {
            setPuzzle(partialSolution); 
            const usedNumbers = new Set(partialSolution.filter(num => num !== null)); 
            setAvailableNumbers(prev => prev.filter(num => !usedNumbers.has(num))); 
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
        const gridSize = difficulty === 3 ? 16 : 9;
        setPuzzle(Array(gridSize).fill(null));
        fetchNumbers();
        resetPartialSolutionFetched();
    };

    const revealSolution = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.solution}?level=${difficulty}`);
            if (response.status === 200) {
                const res = response.data.solution
                setPuzzle(res.flat());
                setAvailableNumbers([]);
                resetPartialSolutionFetched();  // Clear available numbers since the puzzle is solved
            } else {
                setModalMessage("Error fetching the solution. Please try again.");
                setIsError(true);
                setIsModalOpen(true);
            }
        } catch (error) {
            setModalMessage("Error fetching the solution. Please try again.");
            setIsError(true);
            setIsModalOpen(true);
        }
    };

    const submitPuzzle = async () => {
        const size = difficulty === 3 ? 4 : 3;
        const matrix = [];
        for (let i = 0; i < puzzle.length; i += size) {
            matrix.push(puzzle.slice(i, i + size));
        }
        try {
            const response = await axios.post(API_ENDPOINTS.check, { matrix });
            setModalMessage(response.data.message);
            setIsError(false);
            setIsModalOpen(true);
            resetPartialSolutionFetched();
        } catch (error) {
            setModalMessage("Error submitting the puzzle. Please try again.");
            setIsError(true);
            setIsModalOpen(true);
        }
    };

    

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen items-start justify-center pt-4">
                <div className={`grid ${difficulty === 3 ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
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
                        <ButtonDark onClick={revealSolution} label="Reveal Solution"/>
                    </div>
                </div>
                {isModalOpen && (
                    <Modal onClose={closeModal}>
                        <h3 className="text-lg font-bold mb-4">{isError ? 'Error' : showMagicSum ? 'Magic Sum' : 'Message'}</h3>
                        <p>{isError || !showMagicSum ? modalMessage : `The magic sum is: ${magicSum}`}</p>
                    </Modal>
                )}
            </div>
        </DndProvider>
    );
};
