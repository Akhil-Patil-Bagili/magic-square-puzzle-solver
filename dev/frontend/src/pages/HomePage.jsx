import { Appbar } from "../components/Appbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { PuzzleBoard } from "../components/PuzzleBoard";
import { API_ENDPOINTS } from "../apiConfig";

export const HomePage = () => {
    const [user, setUser] = useState({});
    const [difficulty, setDifficulty] = useState(1);
    const [showHintOptions, setShowHintOptions] = useState(false);
    const [selectedHint, setSelectedHint] = useState('');
    const [magicSum, setMagicSum] = useState(null);
    const [partialSolution, setPartialSolution] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }

        const fetchData = async () => {
            try {
                const userResponse = await axios.get(API_ENDPOINTS.profile, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedHint === "magicSum") {
            fetchMagicSum();
        } else if (selectedHint === "partialSolution") {
            fetchPartialSolution();
        }
    }, [selectedHint]);

    const fetchMagicSum = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.hintsMagicSum}?level=${difficulty}`);
            if (response.data.magicSum) {
                setMagicSum(response.data.magicSum);
            } else {
                throw new Error('No magic sum received');
            }
        } catch (error) {
            console.error("Error fetching magic sum:", error);
            alert("Failed to fetch magic sum.");
        }
    };
    
    const fetchPartialSolution = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.hintsPartialSolution}?level=${difficulty}`);
            if (response.data && response.data.partialSolution) {
                const res = response.data.partialSolution
                setPartialSolution(res.flat()); // Assuming partialSolution is correctly structured
            } else {
                throw new Error("Invalid data structure for partial solution");
            }
        } catch (error) {
            console.error("Error fetching partial solution:", error);
            alert("Failed to fetch partial solution: " + (error.response?.data?.message || error.message));
        }
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
                        <select onChange={(e) => setDifficulty(e.target.value)} className="text-center rounded-lg bg-gray-200 p-2 cursor-pointer">
                            <option value="1">Easy</option>
                            <option value="2">Medium</option>
                            <option value="3">Hard (Coming Soon)</option>
                        </select>
                        <div className="inline-block ml-4 relative">
                            <button onClick={() => setShowHintOptions(!showHintOptions)} className="bg-gray-200 p-2 rounded-lg cursor-pointer">
                                Select Hint
                            </button>
                            {showHintOptions && (
                                <ul className="absolute bg-gray-100 mt-1 w-40 rounded-lg overflow-hidden shadow-md text-left">
                                    <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer" onClick={() => { setSelectedHint('magicSum'); setShowHintOptions(false); }}>Magic Sum</li>
                                    <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer" onClick={() => { setSelectedHint('partialSolution'); setShowHintOptions(false); }}>Partial Solution</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <PuzzleBoard difficulty={difficulty} magicSum={magicSum} partialSolution={partialSolution} />
                <div className="pt-10 pb-2 text-center">
                    <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Start</button>
                </div>
            </div>
        </div>
    );
}