'use client';
import React from 'react';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';

export default function DashboardLayout({ children }) {
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
        </main>
      </div>
    </div>
  );
}
