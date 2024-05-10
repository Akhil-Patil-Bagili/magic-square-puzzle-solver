import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BottomWarning } from '../components/BottomWarning';
import { LongButton } from '../components/LongButton';
import { Heading } from '../components/Heading';
import { InputBox } from '../components/InputBox';
import { SubHeading } from '../components/SubHeading';
import { LandingBar } from '../components/LandingBar';
import { API_ENDPOINTS } from '../apiConfig';
import { Modal } from '../components/Modal';

export const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        try {
            const response = await axios.post(API_ENDPOINTS.register, {
                firstName,
                lastName,
                username,
                password
            });

            if (response.status === 201) {
                setModalMessage("User signed up successfully!");
                setIsSuccess(true);
                setIsModalOpen(true);
            } else {
                setModalMessage("Unexpected response from the server.");
                setIsSuccess(false);
                setIsModalOpen(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setModalMessage('A user with this email already exists.');
            } else {
                setModalMessage('An error occurred during sign-up. Please try again later.');
            }
            setIsSuccess(false);
            setIsModalOpen(true);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        if (isSuccess) {
            navigate('/signin');
        }
    };

    return (
        <div>
            <LandingBar />
            <div className="bg-slate-200 h-screen flex justify-center" onKeyDown={handleKeyPress}>
                <div className="flex flex-col justify-center">
                    <form className="rounded-lg bg-white w-80 text-center p-2 h-max px-4" onSubmit={handleSubmit}>
                        <Heading label="Sign up" />
                        <SubHeading label="Enter your information to create an account" />
                        <InputBox onChange={(e) => setFirstName(e.target.value)} placeholder="John" label="First Name" autocomplete="given-name" />
                        <InputBox onChange={(e) => setLastName(e.target.value)} placeholder="Doe" label="Last Name" autocomplete="family-name"/>
                        <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="johndoe@gmail.com" label="Email" autocomplete="email" />
                        <InputBox type="password" onChange={(e) => setPassword(e.target.value)} placeholder="john@12345" label="Password" autocomplete="new-password" />
                        <div className="pt-4">
                            <LongButton label="Sign up" />
                        </div>  
                        <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
                    </form>
                </div>
            </div>
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <h3 className="text-lg font-bold mb-4">{isSuccess ? 'Success' : 'Error'}</h3>
                    <p>{modalMessage}</p>
                </Modal>
            )}
        </div>
    );
};
