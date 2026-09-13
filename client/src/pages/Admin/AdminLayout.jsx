import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F6F2] font-sans flex text-[#2B2320]">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-8 max-w-[1600px] w-full mx-auto space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
