import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
    const { state } = useCart();
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="bg-white border-b border-gray-200 text-gray-800 py-3 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold flex items-center gap-2">
                    <img src="/logo192.png" alt="React Logo" className="h-6 w-6" />
                    Marcus Bikes
                </Link>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li>
                            <Link to="/cart" className="relative inline-flex items-center justify-center">
                                <ShoppingCart size={22} className="text-gray-700" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header; 