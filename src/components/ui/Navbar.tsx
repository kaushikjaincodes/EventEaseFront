import React from 'react';
import { Button } from './button';
const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <div className="text-white text-2xl font-bold">
        Event Ease
      </div>
      <Button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition duration-300">
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;
