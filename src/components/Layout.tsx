import React from "react";
import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="absolute top-2 left-2 bg-neonGreen text-gray-900 px-4 py-2 rounded opacity-0 focus:opacity-100"
      >
        Skip to Main Content
      </a>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main id="main-content" className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-4 text-gray-400">
        <p>© 2024 In My Opinion. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
