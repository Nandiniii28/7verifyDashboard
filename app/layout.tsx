'use client';
import "../styles/globals.css";
import { Sidebar } from "@/components/sidebar";
import Header from "@/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Context } from "./context/context"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
 
  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleNavigate = (route: any) => console.log("Navigating to:", route);
 
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen relative">
          {/* Sidebar */}
          <div
            className={`${
              isMobile ? "hidden" : "block"
            } fixed top-0 left-0 h-full z-30 transition-all duration-300 ${
              sidebarOpen ? "w-60" : "w-20"
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
            className={`transition-all duration-300 min-h-screen ${
              isMobile ? "ml-0" : sidebarOpen ? "ml-60" : "ml-20"
            }`}
          >
            <Header isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
            <main className="">
              <Context>{children}</Context>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}