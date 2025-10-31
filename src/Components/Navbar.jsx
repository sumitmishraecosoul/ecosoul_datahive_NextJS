import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosNotifications } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
// import vectorLogo from "../../public/vectorLogo.jpg";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Clear any stored authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Navigate to login page
        router.push('/login');
        
        // Close dropdown
        setIsDropdownOpen(false);
    };

    const handleContactAdmin = () => {
        // Add contact admin logic here
        console.log('Contact Admin clicked');
        setIsDropdownOpen(false);
    };

    return (
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">

            <div className="flex items-center">
                <img src="/vectorAILogo.svg" alt="Vector AI Logo" className="w-20 h-auto"/>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors duration-200"
                    >
                        <CiUser size={20} />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                            <div className="py-1">
                                <button
                                    onClick={handleContactAdmin}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    Contact Admin
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
