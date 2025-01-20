import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-neonGreen p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nikki's Portfolio</h1>

        <button className="block lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          <span className="text-3xl">&#9776;</span>
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <ul className={`lg:flex space-x-4 mt-4 lg:mt-0 ${isOpen ? 'block' : 'hidden'}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`}>About</NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`}>Contact</NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`}>Blog</NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`}>Projects</NavLink>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
