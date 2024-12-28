import { useState } from 'react'
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className='bg-gray-900 text-neon-green p-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Nikki's Portfolio</h1>
                <button className='block lg:hidden'
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className='text-3xl'>&#9776;</span>
                </button>
            </div>

            <ul
                className={`lg:flex space-x-4 mt-4 lg:mt-0 ${isOpen ? 'block' : 'hidden'}`}>
                <li>
                    <NavLink to='/' className={({ isActive }) =>
                        `px-4 py-2 hover:text-gray-300 transition-colors duration-300 ease-in-out ${isActive ? "text-gray-300 font-bold" : "text-neon-green"
                        }`
                    }
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/about' className={({ isActive }) =>
                        `px-4 py-2 hover:text-gray-300 transition-colors duration-300 ease-in-out ${isActive ? "text-gray-300 font-bold" : "text-neon-green"
                        }`
                    }
                    >
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/contact' className={({ isActive }) =>
                        `px-4 py-2 hover:text-gray-300 transition-colors duration-300 ease-in-out ${isActive ? "text-gray-300 font-bold" : "text-neon-green"
                        }`
                    }
                    >
                        Contact
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/blog' className={({ isActive }) =>
                        `px-4 py-2 hover:text-gray-300 transition-colors duration-300 ease-in-out ${isActive ? "text-gray-300 font-bold" : "text-neon-green"
                        }`
                    }
                    >
                        Blog
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/projects' className={({ isActive }) =>
                        `px-4 py-2 hover:text-gray-300 transition-colors duration-300 ease-in-out ${isActive ? "text-gray-300 font-bold" : "text-neon-green"
                        }`
                    }
                    >
                        Projects
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/login' className={({ isActive }) =>
                        `px-4 py-2 hover:text-gray-300 transition-colors duration-300 ease-in-out ${isActive ? "text-gray-300 font-bold" : "text-neon-green"
                        }`
                    }
                    >
                        Login
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;