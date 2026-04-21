import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`border rounded-xl p-4 shadow-sm bg-white ${className ?? ""}`}>
      {children}
    </div>
  );
};
