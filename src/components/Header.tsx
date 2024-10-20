import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">HiMapp</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="flex items-center"><Package className="mr-1" size={18} /> Products</Link></li>
            <li><Link to="/sales" className="flex items-center"><ShoppingCart className="mr-1" size={18} /> Sales</Link></li>
            <li><Link to="/analytics" className="flex items-center"><BarChart2 className="mr-1" size={18} /> Analytics</Link></li>
            <li><button onClick={logout} className="flex items-center"><LogOut className="mr-1" size={18} /> Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;