"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import DashboardCard from "@/components/dashboard-card";
import Header from "@/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {  lsTokenData } from "./redux/reducer/AdminSlice";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const admin = useSelector(state => state.admin.token);
  const dispatch = useDispatch();
  console.log(admin);

  const router = useRouter()

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleNavigate = (route: any) => {
    console.log("Navigating to:", route);
  };

  // useEffect(() => {
  //   dispatch(lsTokenData());
  // }, []);

  // useEffect(() => {
  //   if (!admin) {
  //     router.push('/login');
  //   }
  // }, [admin]);


  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Sidebar (fixed) */}
      <div
        className={`${isMobile ? "hidden" : "block"
          } fixed top-0 left-0 h-full z-30 transition-all duration-300 ${sidebarOpen ? "w-60" : "w-20"
          }`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleToggleSidebar}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 min-h-screen ${isMobile ? "ml-0" : sidebarOpen ? "ml-60" : "ml-20"
          }`}
      >
        {/* Header */}
        <Header isOpen={sidebarOpen} onToggle={handleToggleSidebar} />

        {/* Page Content */}
        <main className="p-6">
          {/* Page Heading */}
          {/* <div className="mb-6 mx-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Products Cataloguesssss
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and explore your product offerings
            </p>
          </div> */}

          {/* Dashboard Card */}
          <DashboardCard />
        </main>
      </div>
    </div>
  );
}
