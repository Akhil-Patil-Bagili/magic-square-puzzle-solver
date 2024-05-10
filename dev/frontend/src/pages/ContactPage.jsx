import React from 'react';
import { LandingBar } from '../components/LandingBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export const ContactPage = () => {
    return (
        <div>
            <LandingBar />
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Contact Me</h1>
                    <p className="text-md text-gray-600">Interested in collaborating or have a question? Feel free to reach out.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-lg text-gray-700 mb-4">
                        <span>Email me at: </span>
                        <a href="mailto:akhilpatil12345@gmail.com" className="text-blue-500" target="_blank" rel="noopener noreferrer">akhilpatil12345@gmail.com</a>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-2xl font-semibold">Connect with Me</h3>
                        <div className="flex justify-center mt-4">
                            <a href="https://github.com/Akhil-Patil-Bagili" className="text-gray-700 mx-4" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faGithub} size="2x" />
                            </a>
                            <a href="https://www.linkedin.com/in/akhil-patil-bagili/" className="text-gray-700 mx-4" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faLinkedin} size="2x" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
