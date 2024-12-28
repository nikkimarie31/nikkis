import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className='h-screen flex flex-col items-center justify-center bg-darkGray text-white'>
            <h1 className='text-5xl font-bold text-neonGreen mb-4'>404</h1>
            <p className='text-lg'>Oops! The Page you're looking for doesn't exist.</p>
            <Link to='/' className='mt-6 px-6 py-3 bg-neonGreen text-darkGray rounded-full font-bold'>Go Back Home</Link>
        </div>
    );
};

export default NotFound;