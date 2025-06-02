"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";


const navigationItems = [
  {
    id: "dashboard",
    label: "Products Catalogue",
    icon: "bi bi-grid-1x2-fill",
    href: "/",
    isActive: false,
  },
  {
    id: "wallet-ledger",
    label: "Wallet Ledger",
    icon: "bi bi-code-square",
    href: "/wallet-ledger",
    isActive: false,
  },
  {
    id: "all-user-report",
    label: "All User Report",
    icon: "bi bi-code-square",
    href: "/all-user-report",
    isActive: false,
  },
  {
    id: "projects",
    label: "API Catalogue",
    icon: "bi bi-code-square",
    href: "/api-catalogue",
    isActive: false,
  },
  {
    id: "calendar",
    label: "Credentials",
    icon: "bi bi-shield-lock",
    href: "/credentials",
    isActive: false,
  },
  {
    id: "vacations",
    label: "Usage Report",
    icon: "bi bi-graph-up-arrow",
    href: "/usages",
    isActive: false,
  },
  {
    id: "employees",
    label: "VA Configuration",
    icon: "bi bi-robot",
    href: "/va-configuration",
    isActive: false,
  },
  {
    id: "messenger",
    label: "API Status",
    icon: "bi bi-activity",
    href: "/api-status",
    isActive: false,
  },
  {
    id: "info-portal",
    label: "Documentation",
    icon: "bi bi-book",
    href: "/documentation",
    isActive: false,
  },
];

const bottomItems = [
  {
    id: "settings",
    label: "Settings",
    icon: "bi bi-gear",
    href: "/settings",
    isActive: false,
  },
  {
    id: "support",
    label: "Support",
    icon: "bi bi-question-circle",
    href: "/support",
    isActive: false,
  },
];

export function Sidebar({ isOpen = true, onToggle, onNavigate }) {

  const pathname = usePathname();
  const [navItems, setNavItems] = useState(navigationItems);
  const [bottomNavItems, setBottomNavItems] = useState(bottomItems);
  const isMobile = useIsMobile();

  useEffect(() => {
    setNavItems((items) =>
      items.map((item) => ({
        ...item,
        isActive: pathname === item.href,
      }))
    );
    setBottomNavItems((items) =>
      items.map((item) => ({
        ...item,
        isActive: pathname === item.href,
      }))
    );
  }, [pathname]);



  const handleNavClick = (item) => {
    if (onNavigate) {
      onNavigate(item);
    }
    if (isMobile && onToggle) {
      onToggle(false);
    }
  };

  if (isMobile && isOpen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => onToggle && onToggle(false)}
        />
        <aside className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl animate-slide-in">
          {/* Mobile Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <i className="bi bi-lightning-fill text-white text-sm"></i>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Professional Suite</p>
              </div>
            </div>
            <button
              onClick={() => onToggle && onToggle(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="bi bi-x-lg text-gray-500"></i>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    item.isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => handleNavClick(item)}
                >
                  <i
                    className={cn(
                      item.icon,
                      "mr-3 text-lg transition-colors",
                      item.isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                  {item.isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <nav className="space-y-1">
                {bottomNavItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                      item.isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => handleNavClick(item)}
                  >
                    <i
                      className={cn(
                        item.icon,
                        "mr-3 text-lg transition-colors",
                        item.isActive
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* User Profile */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 truncate">
                  john@company.com
                </p>
              </div>
              <i className="bi bi-three-dots text-gray-400"></i>
            </div>
          </div>
        </aside>
      </>
    );
  }

  if (!isMobile) {
    return (
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-white shadow-professional-lg transition-all duration-300 z-30 border-r border-gray-100",
          isOpen ? "w-60" : "w-20"
        )}
        style={{
          margin: "10px",
          borderRadius: "16px",
        }}
      >
        {/* Header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-gray-100 transition-all duration-300",
            isOpen ? "px-6 justify-start" : "px-4 justify-center"
          )}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i className="bi bi-lightning-fill text-white text-sm"></i>
            </div>
            {isOpen && (
              <div className="animate-fade-in">
                <h1 className="font-semibold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Professional Suite</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div
            className={cn("py-6", isOpen ? "px-4" : "px-3")}
            style={{
              height: "calc(100vh - 200px)",
            }}
          >
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "group flex items-center text-sm font-medium rounded-xl transition-all duration-200 relative",
                    isOpen ? "px-3 py-2" : "p-2 justify-center",
                    item.isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm text-[12px]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-[12px]"
                  )}
                  onClick={() => handleNavClick(item)}
                  title={!isOpen ? item.label : undefined}
                >
                  <i
                    className={cn(
                      item.icon,
                      "text-sm transition-colors",
                      isOpen ? "mr-3" : "",
                      item.isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  {isOpen && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.isActive && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </>
                  )}
                  {item.isActive && !isOpen && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* <div
              className={cn(
                "mt-8 pt-6 border-t border-gray-100",
                !isOpen && "border-t-0 mt-6 pt-0"
              )}
            >
              <nav className="space-y-1">
                {bottomNavItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "group flex items-center text-sm font-medium rounded-xl transition-all duration-200 relative",
                      isOpen ? "px-3 py-3" : "p-3 justify-center",
                      item.isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => handleNavClick(item)}
                    title={!isOpen ? item.label : undefined}
                  >
                    <i
                      className={cn(
                        item.icon,
                        "text-lg transition-colors",
                        isOpen ? "mr-3" : "",
                        item.isActive
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    {isOpen && <span className="truncate">{item.label}</span>}
                    {item.isActive && !isOpen && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full"></div>
                    )}
                  </Link>
                ))}
              </nav>
            </div> */}
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-100 p-4">
          {isOpen ? (
            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 truncate">
                  john@company.com
                </p>
              </div>
              <i className="bi bi-three-dots text-gray-400"></i>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <span className="text-white text-sm font-semibold">JD</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  return null;
}
