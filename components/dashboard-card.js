"use client";

import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "./service/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { MainContext } from "@/app/context/context";
import { fetchAdminDetails } from "@/app/redux/reducer/AdminSlice";
import { Loader2 } from "lucide-react";

const ProductTabs = () => {
  const { tostymsg } = useContext(MainContext);
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);

  const [activeTab, setActiveTab] = useState("allService");
  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const paginate = (items) => {
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);
    setServices(paginated);
    setTotalPages(Math.ceil(items.length / limit));
  };

  const fetchServices = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { data } = await axiosInstance.get("/admin/services");
      setAllServices(data.services || []);
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Failed to fetch services.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginate = () => {
    let filtered = [];

    if (activeTab === "allService") {
      filtered = allServices;
    } else if (activeTab === "userServices") {
      filtered = allServices.filter((s) =>
        admin.services?.some((as) => as._id === s._id)
      );
    } else if (activeTab === "NotSubscribed") {
      filtered = allServices.filter(
        (s) => !admin.services?.some((as) => as._id === s._id)
      );
    }

    paginate(filtered);
  };

  const handlePurchase = async (serviceId) => {
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await axiosInstance.post("/user/service-request", {
        userId: admin._id,
        serviceId,
      });

      setMessage({ type: "success", text: data.message });
      dispatch(fetchAdminDetails());
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Purchase request failed.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAdminDetails());
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterAndPaginate();
  }, [activeTab, allServices, admin?.services?.length, page]);

  const tabList = [
    { id: "allService", label: "All Products", icons: "fas fa-code text-sm" },
    {
      id: "userServices",
      label: "Subscribed",
      icons: "fas fa-check-circle text-sm",
    },
    {
      id: "NotSubscribed",
      label: "Not Subscribed",
      icons: "fas fa-times-circle text-sm",
    },
  ];

  return (
    <div className="mx-4 md:mx-10">
      {/* Tabs */}
      <div className="mb-6">
        <ul className="flex flex-wrap gap-2">
          {tabList.map((tab) => (
            <li key={tab.id}>
              <button
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md font-medium transition-all border ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1); // Reset page
                }}
              >
                <i className={tab.icons}></i>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`rounded-md p-3 mb-4 text-sm font-medium ${
            message.type === "error"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
          </div>
        ) : services.length > 0 ? (
          services.map((product) => (
            <article
              key={product._id}
              className="bg-gradient-to-br from-yellow-50 to-[#cbdcf6] rounded-xl border shadow p-4 transition hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="bg-white p-2 rounded-md shadow text-blue-500">
                  <i className="fas fa-video fa-sm"></i>
                </div>
                <span className="bg-white text-xs text-blue-500 px-2 py-1 rounded-full">
                  New
                </span>
              </div>
              <h3 className="text-blue-700 font-bold text-md truncate">
                {product.name.toUpperCase()}
              </h3>
              <p className="text-sm text-blue-600 mt-1 mb-3 line-clamp-3">
                {product.descreption || "No description available"}
              </p>
              <p className="text-blue-700 text-sm font-medium mb-3">
                ₹ {product.charge}
              </p>
              <button
                className="w-full text-sm font-semibold py-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                onClick={() => handlePurchase(product._id)}
              >
                Subscribe Now
              </button>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-blue-500">
            <i className="fas fa-box-open fa-2x mb-2"></i>
            <p className="text-md font-semibold">No services found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
