import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { ButtonDark } from "../components/ButtonDark";
import { Appbar } from "../components/Appbar";
import { InputBox } from "../components/InputBox"; // Ensure you have an InputBox component
import { API_ENDPOINTS } from "../apiConfig";

export const Profile = () => {
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return; 
        }
        
        try {
            const userResponse = await axios.get("http://127.0.0.1:5000/api/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userResponse.data);
            setEditedUser(userResponse.data); // Initialize form with current user data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        console.log(e.target.name)
        console.log(e.target.value)
        setEditedUser({...editedUser, [e.target.name]: e.target.value});
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(API_ENDPOINTS.update, editedUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profile updated successfully!");
            setEditMode(false); 
            fetchUserData(); 
        } catch (error) {
            console.error("Error updating profile:", error.response ? error.response.data.message : "Network Error");
            alert("Failed to update profile.");
        }
    };

    return (
        <div>
            <Appbar user={user}/>
            <div className="bg-slate-100 min-h-screen flex flex-col items-center pt-10">
                <Heading label="Profile" />
                <div className="mt-5 bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                    {editMode ? (
                        <>
                            <InputBox name="firstName" label="First Name" value={editedUser.firstName || ''} onChange={handleInputChange} />
                            <InputBox name="lastName" label="Last Name" value={editedUser.lastName || ''} onChange={handleInputChange} />
                            <InputBox name="password" label="Password (Leave blank to keep current)" onChange={handleInputChange} />
                            <div className="mt-6 flex justify-center">
                                <ButtonDark label="Submit" onClick={handleSubmit} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-lg"><strong>Username:</strong> {user.username}</div>
                            <div className="text-lg"><strong>First Name:</strong> {user.firstName}</div>
                            <div className="text-lg"><strong>Last Name:</strong> {user.lastName}</div>
                            <div className="mt-6 flex justify-center">
                                <ButtonDark label="Edit Profile" onClick={() => setEditMode(true)} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
