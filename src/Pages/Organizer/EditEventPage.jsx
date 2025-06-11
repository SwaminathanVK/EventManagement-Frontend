// src/pages/Organizer/EditEventPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    capacity: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);

  const fetchEventDetails = async () => {
    try {
      const res = await API.get(`/organizer/events/${eventId}`);
      const { title, description, location, date, capacity, image } = res.data.event;
      setFormData({
        title,
        description,
        location,
        date: date.slice(0, 10), // format for input type="date"
        capacity,
        image: image || '',
      });
    } catch (err) {
      toast.error('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/organizer/events/${eventId}`, formData);
      toast.success('Event updated successfully');
      navigate('/organizer/myevents');
    } catch (err) {
      toast.error('Failed to update event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event Title"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Event Description"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
