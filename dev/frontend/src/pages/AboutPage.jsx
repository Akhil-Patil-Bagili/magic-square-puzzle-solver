import React from 'react';
import { ButtonDark } from '../components/ButtonDark';
import { useNavigate } from 'react-router-dom';
import { LandingBar } from '../components/LandingBar';

export const AboutPage = () => {
    const navigate = useNavigate();

    const handleStartSolving = () => {
        navigate('/signup')
    }

    return (
        <div>
            <LandingBar />
            <div className="mx-auto max-w-6xl p-8">
                <section className="text-gray-700 body-font">
                    <div className="container px-5 py-24 mx-auto flex flex-wrap">
                        <div className="flex flex-col text-center w-full mb-20">
                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">About Magic Square App</h1>
                            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                                Welcome to Magic Square App, where numbers align to form perfect squares filled with magic and mystery!
                            </p>
                        </div>
                        <div className="flex flex-wrap md">
                            <div className="md:p-2 p-1 w-full">
                                <div className="bg-gray-100 p-6 rounded-lg">
                                    <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Purpose</h2>
                                    <p className="leading-relaxed text-base">
                                        This app was developed to provide users with a fun and engaging way to explore the mathematical concept of magic squares, improving problem-solving skills through interactive gameplay.
                                    </p>
                                </div>
                            </div>
                            <div className="md:p-2 p-1 w-full">
                                <div className="bg-gray-100 p-6 rounded-lg">
                                    <h2 className="text-lg text-gray-900 font-medium title-font mb-4">About Me</h2>
                                    <p className="leading-relaxed text-base">
                                        I'm Akhil Patil Bagili, the creator behind Magic Square App. Passionate about mathematics and software development, I combined these interests to create an app that makes learning fun and accessible. When I'm not coding or solving puzzles, you'll find me playing online games.
                                    </p>
                                </div>
                            </div>
                            <div className="md:p-2 p-1 w-full">
                                <div className="bg-gray-100 p-6 rounded-lg">
                                    <h2 className="text-lg text-gray-900 font-medium title-font mb-4">Background Story</h2>
                                    <p className="leading-relaxed text-base">
                                        The idea for the Magic Square App came from a desire to blend traditional puzzle-solving with modern technology, providing a platform for users of all ages to improve their mathematical abilities.
                                    </p>
                                </div>
                            </div>
                            <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                                <ButtonDark onClick={handleStartSolving} label="Start Solving" />
                                <p className="text-gray-500 text-sm mt-3">
                                    Ready to start solving puzzles? Dive in now and discover the enchanting world of magic squares!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
