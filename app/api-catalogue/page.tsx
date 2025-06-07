"use client";

import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../context/context";
import axiosInstance from "@/components/service/axiosInstance";


export default function APICataloguePage() {

  const { tostymsg, allService, services } = useContext(MainContext)
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  // const { admin } = useSelector((state) => state.admin);
  const dispatch = useDispatch()

  // console.log(services);

  const createAPI = async (e) => {
    e.preventDefault()
    const data = {
      name: e.target.api.value,
      charge: e.target.charge.value,
      // discription: e.target.discription.value,
    }
    try {
      const res = await axiosInstance.post('/admin/add-services', data);
      tostymsg(res.data.message, 1)
      setShowModal(false);
      allService()
    } catch (error) {

      tostymsg(error.response.data.message, 0)
      console.log(error);
    }


  }

  useEffect(
    () => {
      allService()
    }, []
  )

  return (
    <div className="bg-white rounded-lg shadow mx-4">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Available APIs</h2>
          <button onClick={() => setShowModal(true)} className="mt-3 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
            {services.length > 0 ? (
              services.map((api, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {api.name || "Untitled API"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {api.description || "No description"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${api.method === "GET"
                        ? "bg-green-100 text-green-800"
                        : api.method === "POST"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {api.method || "GET"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {api.endpoint || "/api/example"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${api.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : api.status === "Beta"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {api.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {api.version || "v1.0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => (setShowModal(true), setShowEdit(true))}>Edit</button> */}
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No API services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {/* Overlay click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal content */}
          <div className="relative z-10 bg-white max-w-md p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-gray-800 ">
                {!showEdit ? "Create API" : "Edit API"}
              </div>
              <button onClick={() => setShowModal(false)}>❌</button>
            </div>

            <form className="space-y-4" onSubmit={createAPI}>
              <input
                type="text"
                name="api"
                // defaultValue={showEdit ? "" : ""}
                placeholder="API Name"
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              <input
                type="number"
                name="charge"
                placeholder="Charge"
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                required
              />
              <textarea
                placeholder="Description"
                name="discription"
                className="w-full p-2 border rounded resize-none focus:outline-none focus:ring focus:border-blue-500"
                rows={3}
              ></textarea>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
