import { Appbar } from "../components/Appbar";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { PuzzleBoard } from "../components/PuzzleBoard";
import { API_ENDPOINTS } from "../apiConfig";
import { Loader } from '../components/Loader';

export const HomePage = () => {
    const [user, setUser] = useState({});
    const [difficulty, setDifficulty] = useState(1);
    const [showHintOptions, setShowHintOptions] = useState(false);
    const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);
    const [magicSum, setMagicSum] = useState(null);
    const [partialSolution, setPartialSolution] = useState([]);
    const [partialSolutionFetched, setPartialSolutionFetched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const hintRef = useRef(null);
    const difficultyRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userResponse = await axios.get(API_ENDPOINTS.profile, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false); 
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (hintRef.current && !hintRef.current.contains(event.target)) {
                setShowHintOptions(false);
            }
            if (difficultyRef.current && !difficultyRef.current.contains(event.target)) {
                setShowDifficultyOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleHintSelection = (hintType) => {
        setShowHintOptions(false);
        if (hintType === 'magicSum') {
            fetchMagicSum();
        } else if (hintType === 'partialSolution') {
            fetchPartialSolution();
            setPartialSolutionFetched(true);
        }
    };


    const fetchMagicSum = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_ENDPOINTS.hintsMagicSum}?level=${difficulty}`);
            if (response.data && response.data.magicSum !== undefined) {
                setMagicSum(response.data.magicSum);
                setIsModalOpen(true);
            } else {
                throw new Error('No magic sum received');
            }
        } catch (error) {
            console.error("Error fetching magic sum:", error);
            alert("Failed to fetch magic sum. Please try again.");
        } finally {
            setIsLoading(false); 
        }
    };

    const fetchPartialSolution = async () => {
        if (!partialSolutionFetched) {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_ENDPOINTS.hintsPartialSolution}?level=${difficulty}`);
                if (response.data && response.data.partialSolution) {
                    setPartialSolution(response.data.partialSolution.flat());
                    setPartialSolutionFetched(true);  // Lock fetching further partial solutions
                } else {
                    throw new Error("Invalid data structure for partial solution");
                }
            } catch (error) {
                console.error("Error fetching partial solution:", error);
                alert("Failed to fetch partial solution: " + (error.response?.data?.message || error.message));
            } finally {
                setIsLoading(false); 
            }
        }
    };

    const handleResetPartialSolution = () => {
        setPartialSolutionFetched(false);
    };

    return (
        <div>
            <Appbar user={user}/>
            <div style={{ width: '1100px', minHeight: '1170px', marginTop: '20px' }} className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="pt-2">
                    <h2 className="font-bold text-2xl mb-1 text-gray-900 text-center">Arrange the given numbers in a three by three grid to make a magic square</h2>
                    <div className="flex justify-center">
                        <div className="font-poppins max-w-2xl font-regular text-gray-700 md:text-lg lg:text-xl dark:text-gray-400 text-center">
                            Drag the numbers into the grid cells to make a magic square. The totals of each row, column and diagonal should be the same.
                        </div>
                    </div>
                    <div className="text-center mt-4 mb-2">
                        <div className="inline-block relative" ref={difficultyRef}>
                            <button onClick={() => {setShowDifficultyOptions(!showDifficultyOptions);setPartialSolutionFetched(false);}} className="bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300">
                                Difficulty: {['Easy', 'Medium', 'Hard'][difficulty - 1]}
                            </button>
                            {showDifficultyOptions && (
                                <ul className="absolute bg-gray-100 mt-1 w-40 rounded-lg overflow-hidden shadow-md text-left z-10">
                                    <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer" onClick={() => { setDifficulty(1); setShowDifficultyOptions(false); }}>Easy</li>
                                    <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer" onClick={() => { setDifficulty(2); setShowDifficultyOptions(false); }}>Medium</li>
                                    <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer" onClick={() => { setDifficulty(3); setShowDifficultyOptions(false); }}>Hard</li>
                                </ul>
                            )}
                        </div>
                        <div className="inline-block ml-4 relative" ref={hintRef}>
                            <button onClick={() => setShowHintOptions(!showHintOptions)} className="bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300">
                                Hints
                            </button>
                            {showHintOptions && (
                                <ul className="absolute bg-gray-100 mt-1 w-40 rounded-lg overflow-hidden shadow-md text-left z-10">
                                    <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer" onClick={() => handleHintSelection('magicSum')}>Magic Sum</li>
                                    <li className={`px-4 py-2 hover:bg-gray-300 cursor-pointer ${partialSolutionFetched ? 'text-gray-500 cursor-not-allowed' : ''}`} onClick={() => handleHintSelection('partialSolution')}>Partial Solution</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <PuzzleBoard difficulty={difficulty} magicSum={magicSum} partialSolution={partialSolution} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} resetPartialSolutionFetched={handleResetPartialSolution} />
            </div>
            {isLoading && <Loader />}
        </div>
    );
};
