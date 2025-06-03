import React, { useState } from "react";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabList = [
    { id: "profile", label: "All Products", icons: "fas fa-code text-sm" },
    {
      id: "dashboard",
      label: "Subscribed",
      icons: "fas fa-play-circle text-sm",
    },
    {
      id: "settings",
      label: "Not Subscribed",
      icons: "fas fa-exclamation-circle text-sm",
    },
  ];

  const products = [
    {
      id: 1,
      title: "Video KYC",
      status: "new",
      category: "all",
      content: (
        <article className="relative rounded-md p-4 bg-gradient-to-br from-yellow-50 to-[#cbdcf6] border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-3">
            <div className="bg-[#e6eeff] text-[#4b7fff] p-2 rounded-lg shadow-inner rotate-45">
              <i className="fas fa-video fa-sm rotate-90"></i>
            </div>
            <span className="text-xs font-semibold text-[#4b7fff] bg-[#e6eeff] rounded-full px-3 py-1 shadow-sm select-none">
              New
            </span>
          </div>
          <h3 className="font-bold text-md mb-3 text-[#4b7fff]">Video KYC</h3>
          <p className="text-[#4b7fff] text-[13px] mb-6 leading-relaxed">
            An advanced real-time video verification solution for seamless and
            secure customer authentication.
          </p>
          <div className="flex items-center space-x-2 text-[#4b7fff] text-xs mb-6">
            <button className="flex items-center font-semibold hover:text-[#4577f7] transition">
              <i className="fas fa-video"></i>
              <span className="text-[11px] ml-1">Watch Demo</span>
            </button>
            <button className="flex items-center space-x-2 opacity-60 cursor-not-allowed select-none">
              <i className="far fa-file-alt"></i>
              <span>Documentation</span>
              <i className="fas fa-external-link-alt text-xs"></i>
            </button>
          </div>
          <button className="w-full text-[14px] bg-[#e6eeff] text-[#4b7fff] font-bold rounded-md py-2 hover:bg-[#d1dbf1] transition">
            Subscribe Now
          </button>
        </article>
      ),
    },
    {
      id: 2,
      title: "KYC",
      status: "subscribed",
      category: "subscribed",
      content: (
        <article className="border border-green-100 rounded-md p-4 bg-green-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-green-100 p-2 shadow-inner rounded-md text-green-700 rotate-45">
              <i className="fas fa-plug fa-sm"></i>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-200 rounded-full px-3 py-1">
              Subscribed
            </span>
          </div>
          <h3 className="font-bold text-md mb-3 text-green-700">KYC</h3>
          <p className="text-[#15803d] text-[13px] mb-6 leading-relaxed">
            An extensive collection of 250+ APIs for KYC, KYB, KYV and other
            verification services.
          </p>
          <div className="flex items-center space-x-3 text-gray-500 text-xs mb-5">
            <div className="flex items-center space-x-1 font-semibold">
              <i className="fas fa-video"></i>
              <span>Watch Demo</span>
            </div>
            <div className="flex items-center space-x-1 opacity-50 cursor-not-allowed">
              <i className="far fa-file-alt"></i>
              <span>Documentation</span>
              <i className="fas fa-external-link-alt text-xs"></i>
            </div>
          </div>
          <button className="w-full text-[14px] bg-[#dcfce7] border-gray-200 text-gray-800 font-semibold rounded-md py-2 hover:bg-[#aaf8c5] hover:text-[#15803d] transition flex justify-center items-center space-x-2">
            <span>Manage Subscription</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </article>
      ),
    },
    {
      id: 3,
      title: "Suresign",
      status: "not_activated",
      category: "not_subscribed",
      content: (
        <article className="border h-full border-gray-200 rounded-md p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-gray-100 p-2 rounded-md text-gray-600 rotate-45">
              <i className="fas fa-pen-nib fa-sm rotate-90"></i>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-200 rounded-full px-3 py-1">
              Not Activated
            </span>
          </div>
          <h3 className="font-semibold text-base mb-3">Suresign</h3>
          <p className="text-gray-600 text-[13px] mb-6 leading-relaxed">
            AI powered versatile eSignature suite for Aadhaar eSign, SureSign,
            eStamping, etc.
          </p>
          <div className="flex items-center space-x-3 text-gray-500 text-xs mb-5">
            <div className="flex items-center space-x-1 font-semibold">
              <i className="fas fa-video"></i>
              <span>Watch Demo</span>
            </div>
            <div className="flex items-center space-x-1 opacity-50 cursor-not-allowed">
              <i className="far fa-file-alt"></i>
              <span>Documentation</span>
              <i className="fas fa-external-link-alt text-xs"></i>
            </div>
          </div>
          <button className="w-full text-[14px] bg-[#0b0f1aab] text-white font-semibold rounded-md py-2 hover:cursor-disabled transition">
            Subscribe Now
          </button>
        </article>
      ),
    },
    {
      id: 4,
      title: "Send",
      status: "not_activated",
      category: "not_subscribed",
      content: (
        <article className="border border-gray-200 rounded-md p-5 bg-white hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-gray-100 p-2 rounded-md text-gray-600 rotate-45">
              <i className="fas fa-comment-alt fa-sm"></i>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-200 rounded-full px-3 py-1">
              Not Activated
            </span>
          </div>
          <h3 className="font-semibold text-base mb-2">Send</h3>
          <p className="text-gray-600 text-[13px] mb-5 leading-relaxed">
            A secure SMS delivery service ensuring fast, reliable, and trackable
            sending.
          </p>
          <div className="flex items-center space-x-3 text-gray-500 text-xs mb-51">
            <div className="flex items-center space-x-1 font-semibold">
              <i className="fas fa-video"></i>
              <span>Watch Demo</span>
            </div>
            <div className="flex items-center space-x-1 opacity-50 cursor-not-allowed">
              <i className="far fa-file-alt"></i>
              <span>Documentation</span>
              <i className="fas fa-external-link-alt text-xs"></i>
            </div>
          </div>
          <button className="w-full bg-[#0b0f1aab] text-white font-semibold rounded-md py-2 text-[14px] hover:cursor-disabled transition">
            Subscribe Now
          </button>
        </article>
      ),
    },
  ];

  const filteredProducts =
    activeTab === "dashboard"
      ? products.filter((p) => p.category === "subscribed")
      : activeTab === "settings"
      ? products.filter((p) => p.category === "not_subscribed")
      : products;

  return (
    <div className="mx-10">
      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap mb-px text-sm font-medium text-center"
          role="tablist"
          style={{
            width: "fit-content",
            background: "#ffffff",
            margin: "10px 0px 20px",
            padding: "7px",
          }}
        >
          {tabList.map((tab) => (
            <li className="me-2" role="presentation" key={tab.id}>
              <button
                className={`cursor-pointer flex items-center space-x-1 text-[13px]  px-4 py-2 rounded-t-lg border-b-2 duration-300 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 bg-white border-blue-600 dark:text-blue-500 dark:border-blue-500"
                    : "text-black border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={
                  activeTab === tab.id
                    ? { background: "#e6eeff", borderRadius: "0px" }
                    : {}
                }
              >
                <i className={tab.icons}></i>
                <span> {tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-full">
        {filteredProducts.map((product) => (
          <div key={product.id}>{product.content}</div>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;
