"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { useIsMobile } from "@/hooks/use-mobile"
import { HiOutlineDotsVertical } from "react-icons/hi"

export default function AllUserListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useIsMobile()

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [assigningServiceIndex, setAssigningServiceIndex] = useState<number | null>(null)

  const services = ["Email API", "SMS Gateway", "User Auth", "Billing"]

  const users = [
    { name: "Alice Johnson", verified: true, email: "alice@example.com", partnerId: "P-001" },
    { name: "Bob Smith", verified: false, email: "bob@example.com", partnerId: "P-002" },
    { name: "Charlie Kim", verified: true, email: "charlie@example.com", partnerId: "P-003" },
    { name: "Dana White", verified: false, email: "dana@example.com", partnerId: "P-004" },
    { name: "Evan Thomas", verified: true, email: "evan@example.com", partnerId: "P-005" },
    { name: "Fiona Clarke", verified: true, email: "fiona@example.com", partnerId: "P-006" },
    { name: "George Lee", verified: false, email: "george@example.com", partnerId: "P-007" },
    
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} onNavigate={undefined} />
      <div className={`transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-60" : "ml-28"}`}>
        <Header isOpen={sidebarOpen} onToggle={setSidebarOpen} />

        <main className="p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All User List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 relative">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {user.verified ? "True" : "False"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{user.partnerId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                            className="p-2 rounded hover:bg-gray-100"
                          >
                            <HiOutlineDotsVertical className="h-5 w-5 text-gray-600" />
                          </button>

                          {openMenuIndex === index && (
                            <div className="absolute right-0 mt-2 w-48 z-20 bg-white border border-gray-200 rounded-md shadow-lg">
                              <button
                                onClick={() => {
                                  alert(`Update clicked for ${user.name}`)
                                  setOpenMenuIndex(null)
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => setAssigningServiceIndex(index)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Assign Services
                              </button>
                            </div>
                          )}

                          {assigningServiceIndex === index && (
                            <div className="absolute right-0 mt-2 z-20 bg-white border border-gray-200 rounded-md shadow-lg w-48 max-w-[90vw] overflow-hidden">
                              <ul className="py-2">
                                {services.map((service, sIndex) => (
                                  <li
                                    key={sIndex}
                                    onClick={() => {
                                      alert(`${service} assigned to ${user.name}`)
                                      setAssigningServiceIndex(null)
                                      setOpenMenuIndex(null)
                                    }}
                                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                  >
                                    {service}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

