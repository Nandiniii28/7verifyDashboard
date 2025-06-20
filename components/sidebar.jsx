"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDetails, lsTokenData } from "@/app/redux/reducer/AdminSlice";
import Image from "next/image";
import logo from "@/public/verifyIcon.jpeg"
import ServiceDynamicForm from "@/app/services/page";



export function Sidebar({ isOpen = true, onToggle, onNavigate }) {
  const { admin, token } = useSelector((state) => state.admin);

  // Full navigation list
  const navigationItems = [
    {
      id: "dashboard",
      label: "Products Catalogue",
      icon: "bi bi-box-seam", // Changed from grid to box (products)
      href: "/"
    },
    {
      id: "all-user-list",
      label: "All User List",
      icon: "bi bi-person-lines-fill", // More specific for user lists
      href: "/all-user-list"
    },
    {
      id: "all-user-report",
      label: "All User Report",
      icon: "bi bi-file-earmark-bar-graph", // Better for reports
      href: "/all-user-report"
    },
    {
      id: "KycRequest",
      label: "KYC Request",
      icon: "bi bi-person-check", // More relevant for KYC
      href: "/kycrequest"
    },
    {
      id: "vacations",
      label: "API Usage Report",
      icon: "bi bi-graph-up", // Simplified graph icon
      href: "/usages"
    },
    {
      id: "wallet-ledger",
      label: "Wallet Ledger",
      icon: "bi bi-journal-text", // Better for ledger/transactions
      href: `/userwalletreport/${admin?._id}`
    },
    {
      id: "WalletBalance",
      label: "Wallet Balance",
      icon: "bi bi-currency-exchange", // More financial
      href: "/walletbalance"
    },
    {
      id: "wallet-topup",
      label: "Wallet Topup",
      icon: "bi bi-cash-stack", // Better for top-ups
      href: "/wallet-topup"
    },
    {
      id: "user-topup",
      label: "Topup",
      icon: "bi bi-wallet2",
      href: "/user-topup"
    },
    {
      id: "topup-request",
      label: "Topup Request",
      icon: "bi bi-journal-arrow-up",
      href: "/topup-request"
    },
    {
      id: "services",
      label: "Services",
      icon: "bi bi-collection", // For a collection of services
      children: admin?.services.map(data => (
        { "id": data._id, "label": data.name, "data": data }
      ))
    },
    {
      id: "projects",
      label: "My API",
      icon: "bi bi-plug", // Represents API connections
      href: "/api-catalogue"
    },
    {
      id: "calendar",
      label: "Credentials",
      icon: "bi bi-key-fill", // Better for credentials
      href: "/credentials"
    },
    {
      id: "info-portal",
      label: "Documentation",
      icon: "bi bi-file-earmark-text", // More document-like
      href: "https://7uniqueverify-njzw.readme.io/reference/post_api-verify-bankverify#/"
    },
    {
      id: "AssignServices",
      label: "Assign Services",
      icon: "bi bi-person-gear", // Represents assigning to users
      href: "/assignservices"
    },
    // { 
    //   id: "contact", 
    //   label: "Contact", 
    //   icon: "bi bi-envelope", // Standard contact icon
    //   href: "/contact" 
    // },
    {
      id: "blog",
      label: "Blogs",
      icon: "bi bi-newspaper", // Better for blog content
      href: "/blog"
    },
  ];


  // console.log(admin);
  // const verifyData =()=>{

  // }
  // Bottom items
  const bottomItems = [
    { id: "settings", label: "Settings", icon: "bi bi-gear", href: "/settings" },
    { id: "support", label: "Support", icon: "bi bi-question-circle", href: "/support" },
  ];

  // Role-based nav access config
  const roleBasedAccess = {
    user: ["dashboard", "wallet-ledger", "projects", "calendar", "vacations", "info-portal", "services", "user-topup"],
    admin: [
      "dashboard", "projects", "calendar", "vacations", "info-portal",
      "wallet-topup", "topup-request", "services", "all-user-report", "all-user-list", "KycRequest", "WalletBalance", "AssignServices", "contact", "blog"
    ]
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [navItems, setNavItems] = useState([]);
  const [bottomNavItems, setBottomNavItems] = useState([]);
  const isMobile = useIsMobile();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };
  useEffect(() => {
    if (!isOpen) setOpenDropdownId(null);
  }, [isOpen]);


  useEffect(() => {
    dispatch(lsTokenData());
    dispatch(fetchAdminDetails());
  }, [token]);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  useEffect(() => {
    if (admin?.role) {
      const allowedIds = roleBasedAccess[admin.role] || [];

      setNavItems(
        navigationItems
          .filter((item) => allowedIds.includes(item.id))
          .map((item) => ({
            ...item,
            isActive: pathname === item.href,
          }))
      );

      setBottomNavItems(
        bottomItems.map((item) => ({
          ...item,
          isActive: pathname === item.href,
        }))
      );
    }
  }, [admin?.role, pathname]);

  const handleNavClick = (item) => {
    if (onNavigate) onNavigate(item);
    if (isMobile && onToggle) onToggle(false);
  };


  // const renderUserProfile = () => (
  //   <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
  //     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
  //       <span className="text-white text-sm font-semibold">{admin?.email.charAt(0).toUpperCase()}</span>
  //     </div>
  //     <div className="flex-1 min-w-0">
  //       <p className="text-sm font-medium text-gray-900 truncate">{admin?.name}</p>
  //       <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
  //     </div>
  //     <i className="bi bi-three-dots text-gray-400"></i>
  //   </div>
  // );

  // const renderCompactUserProfile = () => (
  //   <div className="flex justify-center">
  //     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
  //       <span className="text-white text-sm font-semibold">{admin?.email.charAt(0).toUpperCase()}</span>
  //     </div>
  //   </div>
  // );

  if (isMobile && isOpen) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => onToggle?.(false)} />
        <aside className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl">
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Image src={logo} width={10} height={10} alt="logo" />
                {/* <i className="bi bi-lightning-fill text-white text-sm"></i> */}
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Professional Suite</p>
              </div>
            </div>
            <button onClick={() => onToggle?.(false)} className="p-2 rounded-lg hover:bg-gray-100">
              <i className="bi bi-x-lg text-gray-500"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.id} href={item.href} onClick={() => handleNavClick(item)}
                  className={cn("group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all", item.isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900")}
                >
                  <i className={cn(item.icon, "mr-3 text-lg", item.isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                  <span className="truncate">{item.label}</span>
                  {item.isActive && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>}
                </Link>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <nav className="space-y-1">
                {bottomNavItems.map((item) => (
                  <Link key={item.id} href={item.href} onClick={() => handleNavClick(item)}
                    className={cn("group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all", item.isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900")}
                  >
                    <i className={cn(item.icon, "mr-3 text-lg", item.isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="border-t border-gray-100 p-4">
            {renderUserProfile()}
          </div>
        </aside>
      </>
    );
  }

  if (!isMobile) {
    return (
      <aside className={cn("fixed left-0 top-0 bottom-0 bg-white shadow-professional-lg transition-all z-30 border-r border-gray-100", isOpen ? "w-60" : "w-20")}
        style={{ margin: "10px", borderRadius: "16px" }}>
        <div className={cn("h-16 flex items-center border-b border-gray-100", isOpen ? "px-6 justify-start" : "px-4 justify-center")}>
          <div className="flex items-center space-x-3">
            {/* <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"> */}
            <Image src={logo} width={100} height={100} alt="logo" />
            {/* <i className="bi bi-lightning-fill text-white text-sm"></i> */}
            {/* </div> */}
            {isOpen && (
              <div>
                {/* <h1 className="font-semibold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Professional Suite</p> */}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className={cn("py-6", isOpen ? "px-4" : "px-3")} style={{ height: "calc(100vh - 200px)" }}>
            <nav className="space-y-1">
              {navItems.map((item) =>
                !item.children ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    title={!isOpen ? item.label : undefined}
                    className={cn(
                      "group flex items-center text-sm font-medium rounded-xl transition-all relative",
                      isOpen ? "px-3 py-2" : "p-2 justify-center",
                      item.isActive ? "bg-blue-50 text-blue-700 shadow-sm text-[12px]" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-[12px]"
                    )}
                  >
                    <i
                      className={cn(
                        item.icon,
                        "text-sm",
                        isOpen ? "mr-3" : "",
                        item.isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    {isOpen && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.isActive && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                      </>
                    )}
                    {item.isActive && !isOpen && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full" />
                    )}
                  </Link>
                ) : (
                  <div key={item.id} className="relative">
                    <div
                      onClick={() => toggleDropdown(item.id)}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer rounded-xl text-sm font-medium transition-all",
                        isOpen ? "px-3 py-2" : "p-2 justify-center",
                        item.id === openDropdownId ? "bg-blue-50 text-sm font-bold text-blue-700 shadow-sm" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <i className={cn(item.icon, isOpen ? "mr-3" : "", item.id === openDropdownId ? "text-blue-600" : "text-gray-400")} />
                      {isOpen && <span className="flex-1 truncate">{item.label}</span>}
                      {isOpen && <i className={cn("bi", openDropdownId === item.id ? "bi-chevron-up" : "bi-chevron-down", "text-xs ml-auto")} />}
                    </div>

                    {openDropdownId === item.id && isOpen && (
                      <div className="ml-6 mt-1 space-y-1 transition-all">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/services?id=${child.id}`}

                            style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: 'gray',
                              hover: {
                                color: 'blue'
                              }
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}

            </nav>
          </div>
        </div>
        {/* <div className="border-t border-gray-100 p-4">
          {isOpen ? renderUserProfile() : renderCompactUserProfile()}
        </div> */}
      </aside>
    );
  }

  return null;
}
