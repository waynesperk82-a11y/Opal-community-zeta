import React from "react";

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      {children}
    </div>
  );
};
