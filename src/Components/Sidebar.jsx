import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ecosoul_logo from "../../public/ecosoulLogo.svg";
import { FiMenu, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaWarehouse } from 'react-icons/fa6';
import { FaShoppingCart, FaShoppingBasket, FaUserShield } from 'react-icons/fa';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleItemClick = (itemId, href) => {
    if (href) {
      router.push(href);
      return;
    }
    if (itemId === 'supplychain') {
      router.push('/dashboard/supply-chain');
    } else if (itemId === 'ecommerce') {
      router.push('/dashboard/e-commerce');
    } else if (itemId === 'retail') {
      router.push('/dashboard/retail');
    } else if (itemId === 'admin') {
      router.push('/dashboard/admin');
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
      ),
      children: [
        { id: 'sc-overview', label: 'Overview', href: '/dashboard/supply-chain' },
        { id: 'sc-quick-commerce', label: 'Quick Commerce', href: '/dashboard/supply-chain/quick-commerce' },
      ]
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce',
      icon: (
        <FaShoppingCart size={20} />
      ),
      children: [
        { id: 'ec-overview', label: 'Overview', href: '/dashboard/e-commerce' },
        { id: 'ec-pnl', label: 'PNL', href: '/dashboard/e-commerce/pnl' },
        { id: 'ec-inventory', label: 'Inventory', href: '/dashboard/e-commerce/inventory' },
      ]
    },
    {
      id:'retail',
      label: 'Retail',
      icon: (
        <FaShoppingBasket size={20} />
      ),
      children: [
        { id: 'retail-overview', label: 'Overview', href: '/dashboard/retail/overview' },
        { id: 'retail-walmart', label: 'Walmart', href: '/dashboard/retail/walmart' },
        { id: 'retail-ds', label: 'Demand and Supply', href: '/dashboard/retail/demand-and-supply' },
        { id: 'retail-stores', label: 'Retail Stores', href: '/dashboard/retail/stores' },
      ]
    },
    // Admin panel (no dropdowns)
    {
      id: 'admin',
      label: 'Admin',
      icon: (
        <FaUserShield size={20} />
      )
      // no children -> click navigates to /admin
    }
  ]

  // submenu open/close state
  const [openMap, setOpenMap] = useState({});
  useEffect(() => {
    const defaults = {};
    if (pathname.startsWith('/dashboard/supply-chain')) defaults['supplychain'] = true;
    if (pathname.startsWith('/dashboard/e-commerce')) defaults['ecommerce'] = true;
    if (pathname.startsWith('/dashboard/retail')) defaults['retail'] = true;
    setOpenMap(defaults);
  }, [pathname]);

  const toggleOpen = (id) => setOpenMap((m) => ({ ...m, [id]: !m[id] }));

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

  // Determine visible sections based on department
  const [visibleIds, setVisibleIds] = useState(null);
  useEffect(() => {
    try {
      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (!userRaw) return setVisibleIds([]);
      const user = JSON.parse(userRaw);
      const dept = user?.department;
      if (dept === 1) setVisibleIds(['supplychain', 'ecommerce', 'retail', 'admin']);
      else if (dept === 2) setVisibleIds(['retail']);
      else if (dept === 3) setVisibleIds(['ecommerce']);
      else if (dept === 4) setVisibleIds(['supplychain']);
      else setVisibleIds([]);
    } catch {
      setVisibleIds([]);
    }
  }, []);

  const itemsToRender = Array.isArray(visibleIds)
    ? menuItems.filter((i) => visibleIds.includes(i.id))
    : menuItems; // while loading, keep current UI unchanged

  return (
    <div className={`bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 ${containerWidth} h-screen flex flex-col transition-[width] duration-300 ease-in-out`}> 
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <div className={`flex items-center justify-center ${collapsed ? 'w-full' : 'w-full'}`}>
          <img src="/ecosoulLogo.svg" alt="EcoSoul" className={`${collapsed ? 'w-8' : 'w-[10rem]'} h-auto object-contain mx-auto transition-transform duration-300`} />
        </div>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(!collapsed)}
          className="ml-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 active:scale-95 transition"
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      <nav className={`flex-1 ${navPadding} space-y-3`}>
        {itemsToRender.map((item) => (
          <div key={item.id} className="relative group">
            <button
              onClick={() => item.children && !collapsed ? toggleOpen(item.id) : handleItemClick(item.id)}
              title={item.label}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl transition-colors duration-200 border ${
                (item.id === 'supplychain' && pathname.startsWith('/dashboard/supply-chain')) ||
                (item.id === 'ecommerce' && pathname.startsWith('/dashboard/e-commerce')) ||
              (item.id === 'retail' && pathname.startsWith('/dashboard/retail')) ||
              (item.id === 'admin' && pathname.startsWith('/dashboard/admin'))
                  ? 'bg-teal-50 text-teal-700 border-teal-100'
                  : 'bg-white/70 text-gray-700 hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium truncate flex-1 text-left">
                    {item.label}
                  </span>
                  {Array.isArray(item.children) && item.children.length > 0 && (
                    <span className={`text-gray-500 transition-transform duration-200 ${openMap[item.id] ? 'rotate-90' : ''}`}>
                      <FiChevronRight size={16} />
                    </span>
                  )}
                </>
              )}
            </button>

            {!collapsed && Array.isArray(item.children) && item.children.length > 0 && (
              <div className={`origin-top ml-9 space-y-1 transition-all duration-300 ${openMap[item.id] ? 'opacity-100 scale-y-100 max-h-64 mt-2' : 'opacity-0 scale-y-0 max-h-0 pointer-events-none'}`}>
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleItemClick(child.id, child.href)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                      pathname === child.href ? 'bg-teal-50 text-teal-700 border-teal-100' : 'text-gray-600 hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}

            {((item.id === 'supplychain' && pathname.startsWith('/dashboard/supply-chain')) ||
              (item.id === 'ecommerce' && pathname.startsWith('/dashboard/e-commerce')) ||
              (item.id === 'retail' && pathname.startsWith('/dashboard/retail')) ||
              (item.id === 'admin' && pathname.startsWith('/dashboard/admin')))
              && (<span className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-full" />)}

          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
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