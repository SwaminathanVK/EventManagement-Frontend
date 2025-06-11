// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaTag, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { MdEventNote, MdGroup, MdAnalytics, MdPayment } from 'react-icons/md';
import { useAuth } from '../../Context/AuthContext'; // Ensure this path is correct



const HomePage = () => {
  const [events, setEvents] = useState([]); // Removed type annotation <Event[]>
  const [filteredEvents, setFilteredEvents] = useState([]); // Removed type annotation <Event[]>
  const [categories, setCategories] = useState([]); // Removed type annotation <string[]>
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    date: '',
  });
  const [eventsLoading, setEventsLoading] = useState(true); // Removed type annotation <boolean>

  // Use the useAuth hook to get user data and auth status
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // Renamed loading to authLoading to avoid conflict

  const getEvents = async () => {
    setEventsLoading(true); // Set events loading true before fetch
    try {
      const res = await API.get('/events'); // Removed type annotation <{ events: Event[] }>
      const allEvents = res.data.events;
      setEvents(allEvents);
      setFilteredEvents(allEvents); // Initially, filtered events are all events
      const uniqueCategories = [...new Set(allEvents.map(ev => ev.category))];
      setCategories(uniqueCategories);
    } catch (err) { // Removed type annotation : any
      console.error('Failed to load events:', err);
      toast.error(err.response?.data?.message || 'Failed to load events.');
    } finally {
      setEventsLoading(false); // Set events loading false after fetch
    }
  };

  useEffect(() => {
    getEvents();
  }, []); // Run once on component mount

  useEffect(() => {
    applyFilters();
  }, [filters, events]); // Re-apply filters when filters or raw events change

  const applyFilters = () => {
    const { search, category, location, date } = filters;
    const result = events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? event.category === category : true;
      const matchesLocation = location ? event.location.toLowerCase().includes(location.toLowerCase()) : true;
      // Ensure event.date is treated as a string before slicing for date comparison
      const matchesDate = date ? event.date?.slice(0, 10) === date : true;
      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
    setFilteredEvents(result);
  };

  const handleChange = (e) => { // Removed type annotation : ChangeEvent<HTMLInputElement | HTMLSelectElement>
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ search: '', category: '', location: '', date: '' });
  };

  // Default placeholder paths (replace with actual paths as needed)
  const defaultLogoPath = '/images/eventhub-logo.svg'; // Assuming public/images
  const defaultUserAvatarPath = '/images/user-avatar-placeholder.png'; // Assuming public/images
  const defaultEventPlaceholderPath = '/images/event-placeholder.jpg'; // Assuming public/images

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center fixed w-full z-50 top-0">
        <div className="flex items-center space-x-2">
          <img src={defaultLogoPath} alt="EventHub Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-indigo-700">EventHub</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {/* Using Link to full events page instead of root for clarity */}
          <Link to="/events" className="hover:text-indigo-600 transition">Events</Link>
          <Link to="/dashboard" className="hover:text-indigo-600 transition">Dashboard</Link>
          <Link to="/user/my-tickets" className="hover:text-indigo-600 transition">My Tickets</Link>
        </nav>
        {/* Conditional Rendering for Profile/Login/Register */}
        {authLoading ? (
          <div className="flex items-center space-x-3">
            {/* Simple loading skeleton */}
            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : isAuthenticated && user ? (
          <Link to="/user/profile" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200">
            {/* Display user's profile image if available, else a placeholder */}
            <img src={user.profilePicture || defaultUserAvatarPath} alt="User Avatar" className="h-9 w-9 rounded-full object-cover border-2 border-indigo-500" />
            <span className="text-gray-800 font-semibold">{user.name}</span> {/* Display user's name */}
          </Link>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Register</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-center overflow-hidden">
        {/* Background circles (static visual elements from image) */}
        <div className="absolute top-1/4 left-10 w-40 h-40 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-60 h-60 bg-white bg-opacity-10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Create & Discover <br /> <span className="text-yellow-300">Amazing Events</span>
          </h1>
          <p className="text-xl leading-relaxed mb-10 opacity-90 animate-fade-in-up delay-200">
            The ultimate platform for event organizers and attendees. Create memorable experiences and connect with your community.
          </p>
          <div className="flex justify-center space-x-6 animate-fade-in-up delay-400">
            <Link
              to="/events"
              className="bg-white text-indigo-700 hover:bg-gray-100 transition px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center space-x-2"
            >
              <FaSearch className="text-lg" />
              <span>Explore Events</span>
            </Link>
            {/* Conditionally link "Create Event" based on authentication status */}
            <Link
              to={isAuthenticated ? "/user/create-event" : "/register"}
              className="bg-indigo-500 text-white hover:bg-indigo-600 transition px-8 py-4 rounded-full font-bold text-lg shadow-lg flex items-center space-x-2"
            >
              <MdEventNote className="text-lg" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-12 shadow-inner-top -mt-8 relative z-20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <h2 className="text-5xl font-extrabold text-indigo-700">10K+</h2>
            <p className="text-lg text-gray-600">Events Created</p>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold text-indigo-700">500K+</h2>
            <p className="text-lg text-gray-600">Happy Attendees</p>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold text-indigo-700">50+</h2>
            <p className="text-lg text-gray-600">Cities Worldwide</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            From planning to execution, we provide all the tools you need to create unforgettable events and manage them effortlessly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <div className="p-4 bg-purple-100 rounded-xl mb-6">
                <MdEventNote className="text-purple-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Event Creation</h3>
              <p className="text-gray-600 text-center">
                Create beautiful event pages with rich media, schedules, and ticket options.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <div className="p-4 bg-green-100 rounded-xl mb-6">
                <MdGroup className="text-green-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Attendee Management</h3>
              <p className="text-gray-600 text-center">
                Manage registrations, send updates, and track attendance with ease.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <div className="p-4 bg-pink-100 rounded-xl mb-6">
                <MdAnalytics className="text-pink-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Analytics & Insights</h3>
              <p className="text-gray-600 text-center">
                Get detailed analytics on ticket sales, attendance, and revenue.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <div className="p-4 bg-orange-100 rounded-xl mb-6">
                <MdPayment className="text-orange-600 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Secure Payments</h3>
              <p className="text-gray-600 text-center">
                Safe and secure payment processing with multiple payment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800">Featured Events</h2>
            <Link to="/events" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1">
              <span>View All</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 grid grid-cols-1 md:grid-cols-5 gap-4 border border-gray-100">
            <div className="relative col-span-1 md:col-span-2">
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search by title"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="relative">
              <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Location"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="relative">
              <FaTag className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none" // appearance-none to remove default arrow
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {/* Custom arrow for select, if appearance-none is used */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="relative">
              <FaCalendarAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={resetFilters}
              className="bg-red-500 hover:bg-red-600 transition text-white font-semibold py-2 px-4 rounded-lg shadow"
            >
              Reset
            </button>
          </div>

          {/* Events Grid */}
          {eventsLoading ? (
            <div className="col-span-full text-center text-gray-500 text-lg flex flex-col items-center justify-center min-h-[300px]">
                <FaSpinner className="animate-spin text-4xl mb-4 text-indigo-600" />
                Fetching amazing events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-lg p-4 bg-gray-50 rounded-lg shadow-inner">
              No events found matching your criteria. Try adjusting your filters!
            </p>
          ) : (
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Limiting to first 3 for "Featured Events" section as per common homepage design.
                  Consider adding a "View All Events" link clearly if this is the case. */}
              {filteredEvents.slice(0, 3).map((event) => {
                const img = event.images?.[0];
                const video = event.videos?.[0];
                const eventDate = new Date(event.date);
                const isUpcoming = eventDate >= new Date();

                return (
                  <div
                    key={event._id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition duration-300 border border-gray-100"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : video ? (
                      <video controls className="w-full h-48 object-cover">
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-medium">
                        <MdEventNote className="mr-2 text-3xl" /> No Media Available
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-indigo-700 mb-2">{event.title}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2 space-x-2">
                        <FaMapMarkerAlt className="text-indigo-400" />
                        <span>{event.location}</span>
                        <span className="text-gray-400">•</span>
                        <FaTag className="text-indigo-400" />
                        <span>{event.category}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <FaCalendarAlt className="mr-2 text-indigo-400" />
                        <span>{eventDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                        {event.description || 'No description available for this event.'}
                      </p>
                      <Link
                        to={`/events/${event._id}`}
                        className={`inline-block px-6 py-2 rounded-lg font-semibold text-sm transition duration-200 ${
                          isUpcoming
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-80'
                        }`}
                        title={isUpcoming ? 'View event details' : 'Event has concluded'}
                      >
                        {isUpcoming ? 'View Details' : 'Event Ended'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-8">Ready to Create Your Next Event?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of event organizers who trust EventHub to create amazing experiences.
          </p>
          <Link
            to={isAuthenticated ? "/user/create-event" : "/register"}
            className="inline-block bg-white text-indigo-700 hover:bg-gray-100 transition px-10 py-4 rounded-full font-bold text-lg shadow-xl"
          >
            Get Started Free &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={defaultLogoPath} alt="EventHub Logo" className="h-8 w-8 invert" /> {/* Invert for dark background */}
              <span className="text-2xl font-bold text-white">EventHub</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              The ultimate platform for creating, discovering, and managing events. Connect with your audience and create memorable experiences.
            </p>
            <div className="flex space-x-4">
              {/* Add actual social media links (using generic icons, integrate your icon library if needed) */}
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/events" className="hover:text-white transition">Browse Events</Link></li>
              <li><Link to="/user/create-event" className="hover:text-white transition">Create Event</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <i className="fas fa-envelope"></i><span>support@eventhub.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-phone"></i><span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt"></i><span>San Francisco, CA</span>
              </li>
            </ul>
          </div>

          {/* Empty column or add more info if available in images */}
          <div></div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;