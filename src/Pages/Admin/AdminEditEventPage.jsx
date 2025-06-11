// src/pages/Admin/AdminEditEventPage.js

import React, { useState, useEffect } from 'react'; // Removed ChangeEvent, FormEvent
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon

// In JavaScript, interfaces are not used.
// The shape of the form data, fetched event, and payload will be inferred at runtime.

const AdminEditEventPage = () => { // Removed React.FC
  const { id } = useParams(); // Removed type annotation <{ id: string }>
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ // Removed type annotation <EditEventFormData>
    title: '',
    description: '',
    location: '',
    date: '',
    maxAttendees: '',
  });
  const [loading, setLoading] = useState(true); // Removed type annotation <boolean>
  const [isSubmitting, setIsSubmitting] = useState(false); // Removed type annotation <boolean>

  // Fetch event data by id on mount
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) { // Handle case where ID is not provided in URL
        toast.error('Event ID is missing.');
        setLoading(false);
        navigate('/admin/allEvents'); // Redirect to all events
        return;
      }

      try {
        setLoading(true);
        const res = await API.get(`/admin/events/${id}`); // Removed type annotation <{ event: FetchedEvent }>
        const event = res.data.event;

        // Format date from ISO string to 'YYYY-MM-DDTHH:MM' for datetime-local input
        const formattedDate = event.date
          ? new Date(event.date).toISOString().slice(0, 16)
          : '';

        setFormData({
          title: event.title || '',
          description: event.description || '',
          location: event.location || '',
          date: formattedDate,
          maxAttendees: event.maxAttendees?.toString() || '', // Convert number to string for input value
        });
      } catch (err) { // Removed type annotation : any
        console.error('Failed to fetch event data:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch event data.');
        navigate('/admin/allEvents'); // Redirect on error
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]); // Add navigate to dependency array as it's from hook

  const handleChange = (e) => { // Removed type annotation : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => { // Removed type annotation : FormEvent
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare payload, converting numbers back from strings and date string to Date object
      const payload = { // Removed type annotation : UpdateEventPayload
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: new Date(formData.date), // Convert string to Date object
        maxAttendees: Number(formData.maxAttendees), // Convert string to number
      };

      await API.put(`/admin/events/${id}`, payload); // Removed type annotation <FetchedEvent>
      toast.success('Event updated successfully!');
      navigate('/admin/allEvents'); // Consistent navigation to all events page
    } catch (err) { // Removed type annotation : any
      console.error('Failed to update event:', err);
      toast.error(err.response?.data?.message || 'Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-blue-600">
        <FaSpinner className="animate-spin h-10 w-10 mr-3" aria-label="Loading event details" />
        <span className="text-xl font-medium">Loading event details...</span>
      </div>
    );
  }

  return (
    <section className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
          <input
            id="date"
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
          <input
            id="maxAttendees"
            type="number"
            name="maxAttendees"
            value={formData.maxAttendees}
            onChange={handleChange}
            min={1}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-3" /> Updating...
            </>
          ) : (
            'Update Event'
          )}
        </button>
      </form>
    </section>
  );
};

export default AdminEditEventPage;