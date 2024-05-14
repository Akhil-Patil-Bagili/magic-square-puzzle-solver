
import React from 'react';
import { ClipLoader } from 'react-spinners';

export const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <ClipLoader size={50} color={"#ffffff"} />
        </div>
    );
};
