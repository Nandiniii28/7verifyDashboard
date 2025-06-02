"use client"

import { useState } from "react"

export default function CredentialsPage() {
  const credentials = [
    {
      id: 1,
      name: "Production API Key",
      type: "API Key",
      status: "Active",
      created: "2024-01-15",
      lastUsed: "2024-01-30",
    },
    {
      id: 2,
      name: "Development Token",
      type: "Bearer Token",
      status: "Active",
      created: "2024-01-10",
      lastUsed: "2024-01-29",
    },
    {
      id: 3,
      name: "Webhook Secret",
      type: "Secret Key",
      status: "Inactive",
      created: "2024-01-05",
      lastUsed: "2024-01-20",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid gap-6">
        {/* API Keys Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">API Credentials</h2>
              <button className="mt-3 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Generate New Key
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {credentials.map((credential) => (
                <div key={credential.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{credential.name}</h3>
                      <p className="text-sm text-gray-500">{credential.type}</p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>Created: {credential.created}</span>
                        <span>Last used: {credential.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          credential.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {credential.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <i className="bi bi-three-dots-vertical" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">API Rate Limiting</h3>
                  <p className="text-sm text-gray-500">Configure request limits for your API keys</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">Configure</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
