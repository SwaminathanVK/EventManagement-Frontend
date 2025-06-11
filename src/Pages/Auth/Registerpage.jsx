// src/pages/Auth/RegisterPage.jsx

import React, { useState } from 'react'; // Removed ChangeEvent, FormEvent
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon

// In JavaScript, interfaces are not used.
// The structure of the form data will be inferred at runtime.

const RegisterPage = () => { // Removed React.FC
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ // Removed type annotation <FormData>
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); // Removed type annotation <boolean>

  const handleChange = (e) => { // Removed type annotation : ChangeEvent<HTMLInputElement>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => { // Removed type annotation : FormEvent<HTMLFormElement>
    e.preventDefault();
    setLoading(true); // Set loading to true on submission
    try {
      // Assuming your backend sends a success message, but no specific data is needed on the frontend
      await API.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) { // Removed type annotation : any
      console.error('Registration error:', err); // Log the full error for debugging
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Create Your Account</h2>
        <p className="text-center text-gray-600 mb-6">Join us and start exploring events!</p>

        <div className="mb-5">
          <label htmlFor="name" className="sr-only">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-lg placeholder-gray-500"
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-lg placeholder-gray-500"
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-lg placeholder-gray-500"
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button when loading
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-3" /> Registering...
            </>
          ) : (
            'Register'
          )}
        </button>

        <p className="mt-6 text-center text-gray-600 text-base">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-800 hover:underline transition duration-200">
            Login Here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;