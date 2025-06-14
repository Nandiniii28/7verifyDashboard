// "use client";

// import { useState, useEffect } from "react";
// import {
//   FiUser,
//   FiMail,
//   FiPhone,
//   FiMessageSquare,
//   FiCheck,
//   FiX,
//   FiTrash2,
//   FiEye,
//   FiEyeOff,
//   FiChevronDown,
//   FiChevronUp,
//   FiSearch,
// } from "react-icons/fi";
// import { GrContact } from "react-icons/gr";
// import styles from "./contact.module.css";
// import "./contant.css";


// export default function ContactAdminPage() {









//   return (
//     <div className="contact-admin-container">
//   <div className="controls flex">
//       <h2 className="page-title flex gap-2 ">
      
//   <GrContact />Contact</h2>

    
//         <div className="filter-buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <button
//             className={activeFilter === "all" ? "active" : ""}
//             onClick={() => setActiveFilter("all")}
//           >
//             Seen Message
//           </button>
//         </div>

//       </div>

//       {isFormVisible && (
//         <div className="contact-form-card">
//           <h2 className="form-title">Send a Message</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group ">
//               <div className="name-box flex">
//                 <div>
//                   <label htmlFor="name ">

//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="email">

//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="contact">

//                     Contact Number
//                   </label>
//                   <input
//                     type="tel"
//                     id="contact"
//                     name="contact"
//                     value={formData.contact}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="message w-full">
//               <div className="form-group mb-4">
//                 <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
//                   Message
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   rows="4"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 ></textarea>
//               </div>
//             </div>

      
//       )}

//       <div className="submissions-container">
//         <div className="submissions-header">
//           <h3>
//             Messages ({filteredSubmissions.length})
//             <span className="total-count"> / {submissions.length} total</span>
//           </h3>
//         </div>

//         {filteredSubmissions.length === 0 ? (
//           <div className="empty-state">
//             <p>No messages found</p>
//           </div>
//         ) : (
//           <div className="submissions-table">
//             <div className="table-header">
//               <span onClick={() => requestSort("name")}>
//                 Name {getSortIcon("name")}
//               </span>
//               <span onClick={() => requestSort("email")}>
//                 Email {getSortIcon("email")}
//               </span>
//               <span onClick={() => requestSort("date")}>
//                 Date {getSortIcon("date")}
//               </span>
//               <span>Preview</span>
//               <span onClick={() => requestSort("status")}>
//                 Status {getSortIcon("status")}
//               </span>
//               <span>Actions</span>
//             </div>

//             {filteredSubmissions.map((submission) => (
//               <div
//                 key={submission.id}
//                 className={`table-row ${submission.status} ${expandedMessage === submission.id ? "expanded" : ""
//                   }`}
//               >
//                 <div className="row-main">
//                   <span className="name-cell">{submission.name}</span>
//                   <span className="email-cell">
//                     <a href={`mailto:${submission.email}`}>
//                       {submission.email}
//                     </a>
//                   </span>
//                   <span className="date-cell">
//                     {new Date(submission.date).toLocaleString()}
//                   </span>
//                   <span
//                     className="message-preview"
//                     onClick={() => toggleMessageExpansion(submission.id)}
//                   >
//                     {submission.message.length > 30
//                       ? `${submission.message.substring(0, 30)}...`
//                       : submission.message}
//                     {expandedMessage === submission.id ? (
//                       <FiChevronUp className="expand-icon" />
//                     ) : (
//                       <FiChevronDown className="expand-icon" />
//                     )}
//                   </span>
//                   <span className={`status-cell ${submission.status}`}>
//                     {submission.status === "read" ? (
//                       <FiEye className="status-icon" />
//                     ) : (
//                       <FiEyeOff className="status-icon" />
//                     )}
//                     {submission.status}
//                   </span>
//                   <span className="actions-cell">
//                     <button
//                       onClick={() => toggleStatus(submission.id)}
//                       className="status-btn"
//                       title={
//                         submission.status === "read"
//                           ? "Mark as unread"
//                           : "Mark as read"
//                       }
//                     >
//                       {submission.status === "read" ? (
//                         <FiEyeOff />
//                       ) : (
//                         <FiEye />
//                       )}
//                     </button>
//                     <button
//                       onClick={() => deleteSubmission(submission.id)}
//                       className="delete-btn"
//                       title="Delete"
//                     >
//                       <FiTrash2 />
//                     </button>
//                   </span>
//                 </div>

//                 {expandedMessage === submission.id && (
//                   <div className="row-details">
//                     <div className="details-content">
//                       <div className="detail-item">
//                         <strong>Contact:</strong>{" "}
//                         {submission.contact || "Not provided"}
//                       </div>
//                       <div className="detail-item">
//                         <strong>Full Message:</strong>
//                         <div className="full-message">{submission.message}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }