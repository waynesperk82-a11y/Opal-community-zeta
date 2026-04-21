import React from "react";

export const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="px-2 py-1 text-sm rounded-full bg-gray-200">
      {children}
    </span>
  );
};
