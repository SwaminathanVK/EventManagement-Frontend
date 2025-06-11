// src/pages/Admin/AdminCreateEventPage.js

import React, { useState } from 'react';
// Removed: ChangeEvent, FormEvent as they are TypeScript types and no longer needed here
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon

// In JavaScript, we don't use explicit interfaces.
// The shape of the form data state and the payload will be inferred at runtime.
// Removed all interface definitions.

const AdminCreateEventPage = () => { // Removed React.FC
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ // Removed type annotation <EventFormData>
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    price: '',
  });
  const [loading, setLoading] = useState(false); // Removed type annotation <boolean>

  // Changed 'e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>' to just 'e'
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Changed 'e: FormEvent' to just 'e'
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare the payload for the backend, converting string numbers to actual numbers
      const payload = { // Removed type annotation : EventPayload
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date), // Convert date string to Date object
        location: formData.location,
        capacity: Number(formData.capacity), // Convert string to number
        price: Number(formData.price),     // Convert string to number
      };

      const res = await API.post('/admin/events/create', payload); // Removed explicit type <CreateEventResponse>
      
      toast.success(res.data.message || 'Event created successfully!');
      navigate('/admin/allEvents'); // Navigate to the All Events list
    } catch (error) { // Removed type annotation : any
      console.error('Create Event Error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to create event. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g., Annual Tech Conference"
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
            placeholder="A brief overview of the event, its purpose, and key highlights."
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
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
            placeholder="e.g., Virtual (Zoom), City Convention Center"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="e.g., 500"
              value={formData.capacity}
              onChange={handleChange}
              required
              min={1}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="e.g., 299 (set 0 for free events)"
              value={formData.price}
              onChange={handleChange}
              required
              min={0}
              step="0.01"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-3" /> Creating...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </form>
    </section>
  );
};

export default AdminCreateEventPage;