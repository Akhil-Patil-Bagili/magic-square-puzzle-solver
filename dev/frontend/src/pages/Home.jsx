import { Appbar } from "../components/Appbar";
import wip from "../assets/wip.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../apiConfig";


export const Home = () => {
    const [user, setUser] = useState({}); 

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
                console.log(userResponse.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); 
    }, []);

    return <div>
        <Appbar user={user}/>
        <div className="flex justify-center items-center mt-2">
                    <img src={wip} alt="mockup"/>
        </div> 
    </div>
}