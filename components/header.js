"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header({ isOpen, onToggle }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const isMobile = useIsMobile();
  return (
    <header
      className="bg-white/95 backdrop-blur-md shadow-professional border-b border-gray-100 sticky top-4 z-20"
      style={{ borderRadius: "20px", margin: "10px 20px" }}
    >
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left side - Menu toggle and search */}
        <div className="flex items-center space-x-4">
          {/* Menu toggle button */}
          <button
            onClick={() => onToggle(!isOpen)}
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            aria-label="Toggle sidebar"
          >
            <i className="bi bi-list text-xl text-gray-600" />
          </button>

          {/* Search bar - hidden on mobile */}
          {!isMobile && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="bi bi-search text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-gray-50/50 hover:bg-white transition-all duration-200 text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border">
                  ⌘K
                </kbd>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Actions and profile */}
        <div className="flex items-center space-x-3">
          {/* Search button for mobile */}
          {isMobile && (
            <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200">
              <i className="bi bi-search text-xl text-gray-600" />
            </button>
          )}

          {/* Quick actions */}
          {/* <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hidden sm:block">
            <i className="bi bi-plus-lg text-xl text-gray-600" />
          </button> */}

          {/* Messages */}
          {/* <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 relative">
            <i className="bi bi-chat-left-text text-xl text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button> */}

          {/* Live or UAT Tabs */}

          <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
            <input type="checkbox" id="filter" />
            <span>Live</span>
            <span>UAT</span>
          </label>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 relative"
            >
              <i className="bi bi-bell text-xl text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-professional-lg border border-gray-100 z-50 animate-fade-in">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Mark all read
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          New API request received
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your authentication endpoint was called successfully
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          System update completed
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          All services are running smoothly
                        </p>
                        <p className="text-xs text-gray-400 mt-2">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          New user registered
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Welcome email sent automatically
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          3 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                  <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JD</span>
              </div>
              {!isMobile && (
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
              <i className="bi bi-chevron-down text-gray-400 text-sm" />
            </button>

            {/* Profile dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-professional-lg border border-gray-100 z-50 animate-fade-in">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">JD</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">John Doe</p>
                      <p className="text-sm text-gray-500">john@company.com</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <a
                    href="#"
                    className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="bi bi-person mr-3 text-gray-400" />
                    View Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="bi bi-gear mr-3 text-gray-400" />
                    Account Settings
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="bi bi-credit-card mr-3 text-gray-400" />
                    Billing
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="bi bi-question-circle mr-3 text-gray-400" />
                    Help & Support
                  </a>
                  <hr className="my-2 border-gray-100" />
                  <a
                    href="#"
                    className="flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i className="bi bi-box-arrow-right mr-3" />
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobile && (
        <div className="px-6 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="bi bi-search text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-sm"
            />
          </div>
        </div>
      )}
    </header>
  );
}
