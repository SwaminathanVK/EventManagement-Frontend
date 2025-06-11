// src/components/TransferTicketModal.jsx

import React, { useState } from 'react';
import { FaTimes, FaExchangeAlt, FaSpinner } from 'react-icons/fa';
import API from '../../api/axios';
import { toast } from 'react-toastify';

// In JavaScript, we don't use interfaces.
// The props will be destructured and their types inferred at runtime.

const TransferTicketModal = ({ ticketId, isOpen, onClose, refreshTickets }) => {
  const [email, setEmail] = useState(''); // Removed type annotation <string>
  const [loading, setLoading] = useState(false); // Removed type annotation <boolean>
  const [error, setError] = useState(null); // Removed type annotation <string | null>

  const handleTransfer = async () => {
    setError(null); // Clear previous errors

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email validation
      setError('Please enter a valid email address.');
      toast.warning('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post(`/tickets/transfer/${ticketId}`, { recipientEmail: email });
      toast.success(res.data.message || 'Ticket transferred successfully!');
      setEmail(''); // Clear email input on success
      onClose(); // Close modal
      refreshTickets(); // Refresh the parent component's ticket list
    } catch (err) { // Removed type annotation : any
      const errorMessage = err.response?.data?.message || 'Ticket transfer failed. Please try again.';
      setError(errorMessage); // Set inline error message
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // Render nothing if modal is not open

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-200 text-lg"
          aria-label="Close transfer ticket modal"
        >
          <FaTimes />
        </button>

        <div className="flex items-center justify-center mb-6">
          <FaExchangeAlt className="text-blue-600 text-4xl mr-3" />
          <h3 className="text-2xl font-bold text-gray-800">Transfer Ticket</h3>
        </div>

        <p className="text-gray-600 mb-6 text-center">
          Enter the email of the person you wish to transfer this ticket to. They must have an EventHub account.
        </p>

        <label htmlFor="recipientEmail" className="block text-gray-700 font-medium text-sm mb-2">
          Recipient's Email Address:
        </label>
        <input
          id="recipientEmail"
          type="email"
          placeholder="e.g., example@email.com"
          className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 mb-2`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          autoComplete="email"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleTransfer}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg w-full transition-colors duration-200 flex items-center justify-center mt-4"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Transferring...
            </>
          ) : (
            <>
              <FaExchangeAlt className="mr-2" /> Transfer Ticket
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="mt-3 text-gray-600 hover:text-gray-800 text-sm w-full py-2 rounded-lg transition-colors duration-200"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TransferTicketModal;