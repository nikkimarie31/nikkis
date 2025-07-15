import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-darkGray text-gray-900 dark:text-white transition-all duration-300">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="absolute top-2 left-2 bg-babyBlue text-darkGray px-4 py-2 rounded opacity-0 focus:opacity-100 z-50 transition-opacity"
      >
        Skip to Main Content
      </a>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main id="main-content" className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-darkGray text-center py-6 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-babyBlue/20">
        <p>© 2024 In My Opinion. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;