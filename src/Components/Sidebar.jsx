import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ecosoul_logo from "../../public/ecosoulLogo.svg";

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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="4" width="18" height="2" rx="1"/>
          <rect x="3" y="8" width="18" height="2" rx="1"/>
          <rect x="3" y="12" width="18" height="2" rx="1"/>
        </svg>
      )
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="4" width="18" height="2" rx="1"/>
          <rect x="3" y="8" width="18" height="2" rx="1"/>
          <rect x="3" y="12" width="18" height="2" rx="1"/>
        </svg>
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

  return (
    <div className="bg-white shadow-2xl border-r-2 border-gray-200 w-64 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">  
        <div className="w-full h-28 flex items-center justify-center">
          <img src="/ecosoulLogo.svg" alt="EcoSoul" className='w-[10rem] h-auto object-contain' />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-4">
        {menuItems.filter((i) => i.id !== 'retail').map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
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
            
            <span className="text-sm font-medium truncate">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          EcoSoul
        </div>
      </div>
    </div>
  )
}

export default Sidebar;