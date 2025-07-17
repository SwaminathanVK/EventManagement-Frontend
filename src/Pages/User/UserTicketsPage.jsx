import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import {
  FaDownload,
  FaTrash,
  FaExchangeAlt,
  FaSpinner,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import TransferTicketModal from './TransferTicketModal';

const UserTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuth();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await API.get('/tickets/my-tickets');
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch your tickets.');
    } finally {
      setLoadingTickets(false);
    }
  };

  const cancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket? This action cannot be undone and may not be refundable.')) {
      return;
    }

    try {
      const res = await API.delete(`https://online-event-management.onrender.com/api/tickets/cancel/${ticketId}`);
      toast.success(res.data.message || 'Ticket cancelled successfully!');
      fetchTickets();
    } catch (err) {
      console.error('Failed to cancel ticket:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel ticket.');
    }
  };

  const downloadTicket = async (ticket) => {
    toast.info(`Generating PDF for "${ticket.event.title}"...`, { autoClose: 2500 });
    try {
      const input = document.getElementById(`ticket-card-${ticket._id}`);
      if (!input) {
        toast.error('Could not find ticket card to generate PDF.');
        return;
      }

      // Temporarily apply safe styles for html2canvas
      input.style.backgroundColor = '#ffffff';
      input.style.color = '#000000';

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`event_ticket_${ticket.event.title.replace(/\s/g, '_').substring(0, 20)}.pdf`);
      toast.success('Ticket PDF downloaded!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download ticket. Please try again.');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const formatDateTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      console.error('Invalid date string:', isoString);
      return 'Invalid Date';
    }
  };

  if (loadingTickets) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-blue-600">
        <FaSpinner className="animate-spin h-16 w-16 mb-4" aria-label="Loading your tickets" />
        <span className="text-2xl font-medium">Loading your tickets...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          <FaTicketAlt className="inline-block text-indigo-600 mr-4 align-middle" /> My Tickets
        </h2>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-600 border border-dashed border-gray-300">
            <p className="text-lg mb-4">You haven't booked any tickets yet!</p>
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => {
              const eventDate = new Date(ticket.event.date);
              const isUpcoming = eventDate > new Date();
              const isCancelled = ticket.status === 'cancelled';
              const isTransferred = ticket.status === 'transferred';
              const isBooked = ticket.status === 'booked' || ticket.status === 'pending';

              return (
                <div
                  key={ticket._id}
                  id={`ticket-card-${ticket._id}`}
                  className={`bg-white rounded-xl shadow-lg p-6 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.01] ${
                    isCancelled ? 'border-l-8 border-red-500 opacity-80' : 'border-l-8 border-indigo-500'
                  } ${isTransferred ? 'border-l-8 border-yellow-500' : ''}`}
                  style={{ backgroundColor: '#ffffff', color: '#000000' }} // Fix for html2canvas oklch error
                >
                  {isCancelled && (
                    <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      Cancelled
                    </span>
                  )}
                  {isTransferred && (
                    <span className="absolute top-4 right-4 bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      Transferred
                    </span>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{ticket.event.title}</h3>

                  <p className="text-gray-700 text-base mb-1">
                    <span className="font-semibold">{ticket.ticketType} Ticket</span>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      Qty: {ticket.quantity}
                    </span>
                  </p>

                  <p className="text-gray-800 text-base mb-1">
                    Single Ticket Price: ₹{ticket.price?.toFixed(2)}
                  </p>

                  <p className="text-gray-800 text-lg font-bold mb-3">
                    Total Price: ₹{ticket.totalAmount ? ticket.totalAmount.toFixed(2) : '0.00'}
                  </p>

                  <div className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-400" />
                    <span>{formatDateTime(ticket.event.date)}</span>
                  </div>

                  <div className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-400" />
                    <span>{ticket.event.location}</span>
                  </div>

                  <p className="text-xs text-gray-500 italic mb-4">
                    Booked On: {formatDateTime(ticket.createdAt)}
                  </p>

                  <div className="mt-4 flex flex-col space-y-3">
                    <button
                      onClick={() => downloadTicket(ticket)}
                      className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
                      title="Download Ticket"
                      disabled={isCancelled || isTransferred || !isBooked}
                    >
                      <FaDownload className="mr-2" /> Download Ticket
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTicketId(ticket._id);
                        setShowTransferModal(true);
                      }}
                      className="w-full flex items-center justify-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
                      title="Transfer Ticket"
                      disabled={isCancelled || isTransferred || !isUpcoming || !isBooked}
                    >
                      <FaExchangeAlt className="mr-2" /> Transfer Ticket
                    </button>

                    <button
                      onClick={() => cancelTicket(ticket._id)}
                      className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
                      title="Cancel Ticket"
                      disabled={isCancelled || !isUpcoming || !isBooked}
                    >
                      <FaTrash className="mr-2" /> Cancel Ticket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showTransferModal && selectedTicketId && (
          <TransferTicketModal
            ticketId={selectedTicketId}
            isOpen={showTransferModal}
            onClose={() => {
              setShowTransferModal(false);
              setSelectedTicketId(null);
            }}
            refreshTickets={fetchTickets}
          />
        )}
      </div>
    </div>
  );
};

export default UserTicketsPage;