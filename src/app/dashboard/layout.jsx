'use client';
import React, { useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import { PopoverRoot, PopoverTrigger, PopoverContent, NotesPanel } from '../../Components/PopNotes';
import { FaRegStickyNote } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (!token || !userRaw) {
      router.replace('/login');
      return;
    }
    try {
      const user = JSON.parse(userRaw);
      const department = user?.department;

      // Admin (1) has access to everything under /dashboard
      const isAdmin = department === 1;
      const isRetail = department === 2;
      const isEcommerce = department === 3;
      const isSupplyChain = department === 4;

      const path = pathname || '';
      const under = (segment) => path.startsWith(`/dashboard/${segment}`);

      let allowed = false;
      if (isAdmin) {
        allowed = true;
      } else if (isRetail) {
        allowed = under('retail');
      } else if (isEcommerce) {
        allowed = under('e-commerce');
      } else if (isSupplyChain) {
        allowed = under('supply-chain');
      }

      // Base /dashboard landing: allow for all, we will redirect users to their section in login
      if (path === '/dashboard') {
        allowed = true;
      }

      if (!allowed) {
        // Redirect to the department home as a safe fallback
        if (isRetail) router.replace('/dashboard/retail');
        else if (isEcommerce) router.replace('/dashboard/e-commerce');
        else if (isSupplyChain) router.replace('/dashboard/supply-chain');
        else router.replace('/dashboard');
      }
    } catch {
      router.replace('/login');
    }
  }, [pathname, router]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Main content area with sidebar */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar on the left */}
        <Sidebar />
        
        {/* Main content area */}
        <main className="flex-1 ml-0 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
          {/* Floating Notes Button */}
          <div className="fixed bottom-6 right-6 z-[9997]">
            <PopoverRoot>
              <PopoverTrigger className="rounded-full shadow-lg bg-teal-500 hover:bg-teal-600 text-white w-14 h-14 flex items-center justify-center">
                <FaRegStickyNote size={20} />
              </PopoverTrigger>
              <PopoverContent>
                <NotesPanel />
              </PopoverContent>
            </PopoverRoot>
          </div>
        </main>
      </div>
    </div>
  );
}
