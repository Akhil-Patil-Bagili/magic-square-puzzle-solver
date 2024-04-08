import { Appbar } from "../components/Appbar";
import wip from "../assets/wip.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { PuzzleBoard } from "../components/PuzzleBoard";
import { HeroSubHeading } from "../components/HeroSubHeading";


export const HomePage = () => {
    const [user, setUser] = useState({}); 
    const [puzzle, setPuzzle] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return; 
        }

        const fetchData = async () => {
            try {
                const userResponse = await axios.get("http://127.0.0.1:5000/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userResponse.data); 
                console.log(userResponse.data)

                const puzzleResponse = await axios.get("http://127.0.0.1:5000/api/puzzle");
                setPuzzle(puzzleResponse.data.puzzle);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); 
    }, []);

    return <div>
        <Appbar user={user}/>
        <div  style={{ width: '1100px', height: '1170px', marginTop: '20px' }} className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="pt-2">
                <h2 className="font-bold text-2xl mb-2 text-gray-900 text-center">Arrange the given numbers in a three by three grid to make a magic square</h2>
                <div className="flex justify-center">
                    <div className="font-poppins max-w-2xl font-regular text-gray-700 md:text-lg lg:text-xl dark:text-gray-400 text-center">
                        Drag the numbers into the grid cells to make a magic square. The totals of each row, column and diagonal should be the same.
                    </div>
                </div>
            </div>
                <PuzzleBoard/>
            <div className="pt-30 pb-2 text-center">
                <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Start</button>
            </div>
            </div>
        </div>
}