"use client";
import { ReactNode } from "react";

interface ButtonProps {
  disabled?: boolean;  // ✅ Made optional
  loading?: boolean;   // ✅ Made optional
  children: ReactNode;
  onClick: () => void;
}

export const Button = ({ onClick, children, loading = false, disabled = false }: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button 
      onClick={onClick} 
      type="button" 
      disabled={isDisabled}
      className={`
        font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none focus:ring-4 transition-all duration-200
        ${isDisabled 
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 focus:ring-gray-200' 
          : 'bg-black text-white hover:bg-gray-900 focus:ring-gray-300'
        }
      `}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};