"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { useIsMobile } from "@/hooks/use-mobile"

export default function APICataloguePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useIsMobile()

  const apiEndpoints = [
    {
      id: 1,
      name: "User Authentication",
      method: "POST",
      endpoint: "/api/auth/login",
      description: "Authenticate user credentials",
      status: "Active",
      version: "v1.2",
    },
    {
      id: 2,
      name: "Get User Profile",
      method: "GET",
      endpoint: "/api/users/{id}",
      description: "Retrieve user profile information",
      status: "Active",
      version: "v1.0",
    },
    {
      id: 3,
      name: "Create Product",
      method: "POST",
      endpoint: "/api/products",
      description: "Create a new product entry",
      status: "Beta",
      version: "v2.0",
    },
    {
      id: 4,
      name: "Payment Processing",
      method: "POST",
      endpoint: "/api/payments/process",
      description: "Process payment transactions",
      status: "Active",
      version: "v1.5",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} onNavigate={undefined} />

      <div className={`transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-60" : "ml-28"}`}>
        <Header isOpen={sidebarOpen} onToggle={setSidebarOpen} />

         <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">API Catalogue</h1>
            <p className="text-gray-600 mt-1">Browse and manage your API endpoints</p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Available APIs</h2>
                <button className="mt-3 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add New API
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endpoint
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiEndpoints.map((api) => (
                    <tr key={api.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{api.name}</div>
                          <div className="text-sm text-gray-500">{api.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            api.method === "GET"
                              ? "bg-green-100 text-green-800"
                              : api.method === "POST"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {api.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{api.endpoint}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            api.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : api.status === "Beta"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {api.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{api.version}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
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
