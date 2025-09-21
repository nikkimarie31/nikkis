import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/home", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },

  ];

  const authItems = [
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Sign Up" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-darkGray/95 backdrop-blur-md px-6 py-4 z-50 border-b border-gray-200 dark:border-babyBlue/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NavLink 
              to="/" 
              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-babyBlue transition-colors duration-300"
            >
              Nicole <span className="text-babyBlue">Vallencourt</span>
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <motion.ul 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {navItems.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `navbar-link relative py-2 px-1 transition-all duration-300 ${
                        isActive 
                          ? 'text-babyBlue' 
                          : 'text-gray-700 dark:text-gray-300 hover:text-babyBlue'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-babyBlue"
                            layoutId="activeTab"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>

            {/* Auth Links */}
            <div className="flex items-center space-x-3">
              {authItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                      item.to === '/signup'
                        ? 'btn-primary text-sm py-2'
                        : 'text-gray-700 dark:text-gray-300 hover:text-babyBlue'
                    } ${isActive ? 'text-babyBlue' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-babyBlue transition-colors duration-300 p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-center items-center"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 }
                  }}
                  className="block w-6 h-0.5 bg-current transform transition-all duration-300"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  className="block w-6 h-0.5 bg-current mt-1.5 transition-all duration-300"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 }
                  }}
                  className="block w-6 h-0.5 bg-current mt-1.5 transform transition-all duration-300"
                />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700"
            >
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-babyBlue/10 text-babyBlue border-l-4 border-babyBlue'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-babyBlue'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
                
              {/* Mobile Auth Links */}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {authItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg transition-all duration-300 ${
                        item.to === '/signup'
                          ? 'btn-primary text-center'
                          : isActive
                          ? 'bg-babyBlue/10 text-babyBlue'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-babyBlue'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;