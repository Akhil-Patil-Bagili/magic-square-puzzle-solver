import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg relative">
        {children}
        <button
          className="absolute top-2 right-2 text-lg font-bold"
          onClick={onClose}
        >
          &times; {/* Close button */}
        </button>
      </div>
    </div>
  );
};

export default Modal;
