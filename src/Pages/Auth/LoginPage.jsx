// src/pages/Auth/LoginPage.jsx

import React, { useState } from 'react'; // Removed ChangeEvent, FormEvent
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios.js';
import { useAuth } from '../../Context/AuthContext.jsx'; // Import useAuth, corrected extension
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon

// In JavaScript, interfaces are not used.
// The structure of User and LoginResponse will be inferred at runtime.

const LoginPage = () => { // Removed React.FC
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure 'login' function from useAuth

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Removed type annotation <boolean>

  const handleChange = (e) => { // Removed type annotation : ChangeEvent<HTMLInputElement>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // Removed type annotation : FormEvent
    e.preventDefault();
    setLoading(true); // Set loading to true on submission
    try {
      const res = await API.post('/auth/login', formData); // Removed type annotation <LoginResponse>
      const { token, user } = res.data;

      // Call the login function from AuthContext to handle state updates and localStorage
      login(user, token);

      toast.success('Login successful!');

      // Navigate based on user role
      if (user.role === 'admin' || user.role === 'organizer' || user.role === 'user') {
        navigate(`/${user.role}/dashboard`);
      } else {
        // Fallback for unexpected roles, navigate to a default page or show an error
        navigate('/home'); // Or a generic dashboard if applicable
        toast.warn('Logged in with an unrecognized role. Redirecting to home.');
      }
    } catch (err) { // Removed type annotation : any
      console.error('Login error:', err); // Log the full error for debugging
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your account to continue.</p>

        <div className="mb-5">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg placeholder-gray-500"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg placeholder-gray-500"
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button when loading
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-3" /> Logging In...
            </>
          ) : (
            'Login'
          )}
        </button>

        <p className="mt-6 text-center text-gray-600 text-base">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition duration-200">
            Register Here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;