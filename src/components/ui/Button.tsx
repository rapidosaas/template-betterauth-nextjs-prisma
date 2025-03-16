import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Button({ type = "button", onClick, children, disabled, className }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-white font-bold py-2 px-4 rounded transition-all ${
        disabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}
