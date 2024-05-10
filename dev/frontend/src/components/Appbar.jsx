import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

export const Appbar = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const initial = user && user.firstName? user.firstName.charAt(0)+user.lastName.charAt(0) : '?';
    const menuRef = useRef(); 

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        navigate("/signin");
        localStorage.clear();
        sessionStorage.clear();
    };

    const handleProfile = () => {
        navigate("/profile");
    }

    return (
        <div className="shadow h-14 flex justify-between items-center px-4 font-poppins">
            <a href="/home" className="flex items-center justify-center text-3xl font-bold font-poppins">
                 <img src={logo} alt="Your Logo" className="h-12 w-auto mr-2" />
            </a>
            <div className="flex items-center" ref={menuRef}>
                <div className="flex flex-col justify-center h-full mr-4 text-gray-700">
                    Hello, {user && user.firstName ? user.firstName : 'Guest'}
                </div>
                <button onClick={toggleMenu} className="rounded-full w-12 h-12 bg-gray-200 flex justify-center items-center text-xl cursor-pointer text-gray-700">
                    {initial}
                </button>
                {isMenuOpen && (
                    <div className="absolute right-5 top-12 mt-1 w-48 bg-white rounded-md shadow-lg z-50">
                        <ul className="py-1">
                            <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleProfile}>Profile</li>
                            <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
