import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`border rounded-xl p-4 shadow-sm bg-white ${className}`}>
      {children}
    </div>
  );
};
