import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;