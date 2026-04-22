import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
