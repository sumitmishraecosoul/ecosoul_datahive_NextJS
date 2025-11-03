import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ecosoul_logo from "../../public/ecosoulLogo.svg";
import { FiMenu, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaWarehouse } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleItemClick = (itemId) => {
    if (itemId === 'supplychain') {
      router.push('/dashboard/supply-chain');
    } else if (itemId === 'ecommerce') {
      router.push('/dashboard/e-commerce');
    } else if (itemId === 'retail') {
      router.push('/dashboard/retail');
    } else {
      router.push(`/${itemId}`);
    }
  };

  const menuItems = [
    {
      id: 'supplychain',
      label: 'Supply Chain',
      icon: (
        <FaWarehouse size={20} />
      )
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce',
      icon: (
        <FaShoppingCart size={20} />
      )
    },
    {
      id:'retail',
      label: 'Retail',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="4" width="18" height="2" rx="1"/>
          <rect x="3" y="8" width="18" height="2" rx="1"/>
          <rect x="3" y="12" width="18" height="2" rx="1"/>
        </svg>
      )
    }
  ]

  const [collapsed, setCollapsed] = useState(false);

  const containerWidth = collapsed ? 'w-16' : 'w-64';
  const navPadding = collapsed ? 'p-2' : 'p-4';

  // Auto-collapse on small screens to improve responsiveness without altering UI content
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setCollapsed(window.innerWidth < 1024); // collapse on screens smaller than lg
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`bg-white shadow-2xl border-r-2 border-gray-200 ${containerWidth} h-screen flex flex-col transition-all duration-300`}> 
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <div className={`flex items-center justify-center ${collapsed ? 'w-full' : 'w-full'}`}>
          <img src="/ecosoulLogo.svg" alt="EcoSoul" className={`${collapsed ? 'w-8' : 'w-[10rem]'} h-auto object-contain mx-auto`} />
        </div>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(!collapsed)}
          className="ml-2 p-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      <nav className={`flex-1 ${navPadding} space-y-4`}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            title={item.label}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg transition-all duration-200 ${
              (item.id === 'supplychain' && pathname.startsWith('/dashboard/supply-chain')) ||
              (item.id === 'ecommerce' && pathname.startsWith('/dashboard/e-commerce')) ||
              (item.id === 'retail' && pathname.startsWith('/dashboard/retail'))
                ? 'bg-blue-100 text-blue-600 border-r-2 border-blue-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            {!collapsed && (
              <span className="text-sm font-medium truncate">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200">
        {!collapsed && (
          <div className="text-xs text-gray-500 text-center">
            EcoSoul
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar;