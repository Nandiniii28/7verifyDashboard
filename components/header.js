"use client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import axiosInstance from "./service/axiosInstance";
import { MainContext } from "@/app/context/context";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDetails, logout } from "@/app/redux/reducer/AdminSlice";
import Link from "next/link";
 
export default function Header({ isOpen, onToggle }) {
  const { tostymsg } = useContext(MainContext)
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const isMobile = useIsMobile();
  const dispatch = useDispatch()
  const { admin } = useSelector(state => state.admin)
  const [environment, setEnvironment] = useState("uat");
  const [showUATModal, setShowUATModal] = useState(false);
 
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
 
 
  const handleEnvironmentSwitch = async (env) => {
    const userId = admin._id;
 
    let environment_mode = env === "live" ? true : false;
 
    if (admin?.documents?.isVerified) {
      try {
        const res = await axiosInstance.put(`/admin/status-change/${userId}`, { environment_mode });
        console.log("Environment change response:", res.data);
 
        setEnvironment(env); // Update local state
        dispatch(fetchAdminDetails()); // Refresh admin data
        // tostymsg("Environment updated", "success");
      } catch (error) {
        console.error("Failed to update environment mode:", error);
        // tostymsg("Failed to change environment", "error");
      }
    } else {
      setShowUATModal(true);
    }
  };
 
 
  const closeUATModal = () => {
    setShowUATModal(false);
    setEnvironment("uat"); // Switch back to live when modal is closed
  };
 
  // form
  const [message, setMessage] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formData = new FormData(e.target);
 
    const panCard = formData.get("panCard");
    const aadhaarCard = formData.get("aadhaarCard");
    const gstCert = formData.get("gstCert");
 
 
    try {
      const response = await axiosInstance.post("/user/upload-kyc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
 
      console.log("Upload Success:", response.data);
      tostymsg(response.data.message, response.data.status)
      setShowUATModal(false);
      setEnvironment("uat");
      // Optionally show a success message
    } catch (error) {
      console.error("Upload Failed:", error);
      // Optionally show an error message
    }
  };
 
  // useEffect(
  //   () => {
  //     dispatch(fetchAdminDetails())
  //   }, [environment, admin?.environment_mode]
  // )
 
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (admin?.documents?.isVerified) {
  //       setEnvironment("live");
  //     }
  //   }, 200);
 
  //   return () => clearTimeout(timeout);
  // }, [environment, admin]);
  return (
    <>
      <header
        className="bg-white/95 backdrop-blur-md shadow-professional border-b border-gray-100 sticky top-0 z-20"
        style={{ borderRadius: "20px", margin: "10px 20px" }}
      >
        <div className="flex items-center justify-between px-6 py-2">
          {/* Left side - Menu toggle and search */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onToggle(!isOpen)}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              aria-label="Toggle sidebar"
            >
              <i className="bi bi-list text-xl text-gray-600" />
            </button>
 
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
 
          {/* Right side - Environment Toggle, Wallet, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Environment Toggle */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Environment:</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleEnvironmentSwitch("uat")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${environment === "uat"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  UAT
                </button>
                <button
                  // disabled={admin?.documents?.isVerified}
                  onClick={() => handleEnvironmentSwitch("live")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${environment === "live"
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  LIVE
                </button>
              </div>
            </div>
 
            {/* Wallet Info */}
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
              <i className="bi bi-wallet2 text-blue-600 text-xl mr-3" />
              <div className="mr-4">
                <p className="text-xs text-gray-500">Wallet Balance</p>
                <p className="text-xs font-semibold text-gray-900">₹ {!admin?.environment_mode ? admin?.wallet?.mode?.credentials : admin?.wallet?.mode?.production
                  || 0}</p>
              </div>
              {/* <button className="bg-blue-600 hover:bg-blue-700  text-xs font-medium px-3 py-1.5 rounded-lg">
 
                <Link href={'wallet-topup'}><i className="bi bi-plus-circle mr-1" />
                  Topup
                </Link>
              </button> */}
            </div>
 
            {/* Notifications Button */}
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
                          <p className="text-xs text-gray-400 mt-2">
                            1 hour ago
                          </p>
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
 
 
            {/* Profile Button */}
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{admin?.email.charAt(0).toUpperCase()}</span>
                </div>
                {!isMobile && (
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {admin?.name}
                    </p>
                    <p className="text-xs text-gray-500">{admin?.role}</p>
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
                        <span className="text-white font-semibold">{admin?.email.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{admin?.name}</p>
                        <p className="text-sm text-gray-500">
                          {admin?.email}
                        </p>
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
                    <button
                      onClick={() => dispatch(logout())}
                      className="flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <i className="bi bi-box-arrow-right mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
 
        {/* Mobile Search */}
        {
          isMobile && (
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
          )
        }
      </header >
 
      {/* Full Screen UAT Modal */}
      < Dialog open={showUATModal} onOpenChange={setShowUATModal} >
        <DialogContent
          className="fixed w-100 h-100 translate-x-[-50%] translate-y-[-50%] inset-0 m-0 p-0 rounded-md border-0"
          style={{ left: "50%", top: "40%" }}
        >
          <div className="relative bg-gradient-to-br p-6 rounded-md from-blue-50 via-orange-100 to-blue-200 flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeUATModal}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white hover:bg-white transition-all shadow-lg"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
 
            {/* Modal Content */}
            <div className="">
              <h2 className="text-xl font-bold mb-4">Upload Documents</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Pancard</label>
                  <input
                    type="file"
                    name="panCard"
                    required
                    className="border border-gray-600 rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Aadharcard</label>
                  <input
                    type="file"
                    name="aadhaarCard"
                    required
                    className="border border-gray-600 rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">GST</label>
                  <input
                    type="file"
                    name="gstCert"
                    required
                    className="border border-gray-600 rounded p-2 w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog >
    </>
  );
}