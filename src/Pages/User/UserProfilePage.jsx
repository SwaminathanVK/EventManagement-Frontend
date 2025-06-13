// src/Pages/User/UserProfilePage.jsx

import React, { useEffect, useState } from "react"; // Removed ChangeEvent, FormEvent
import API from "../../api/axios"; // Ensure your axios instance is configured to send tokens
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSave,
  FaSignOutAlt,
  FaSpinner,
} from "react-icons/fa"; // Added FaSpinner for loading

// In JavaScript, we do not use explicit interfaces.
// The structure of the user object and form data will be inferred at runtime.

const UserProfilePage = () => { // Removed React.FC
  // Destructure from useAuth to get user data, auth status, logout function, and setUser for context update
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    logout,
    setUser,
  } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ // Removed type annotation <FormData>
    name: "",
    email: "",
    password: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true); // Removed type annotation <boolean>
  const [updatingProfile, setUpdatingProfile] = useState(false); // Removed type annotation <boolean>

  // --- Effect to redirect if not authenticated ---
  useEffect(() => {
    // If authLoading is complete and user is not authenticated, redirect to login
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to view your profile.", { autoClose: 3000 });
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]); // Dependencies for this effect

  // --- Effect to fetch user profile data on component mount or relevant state changes ---
  useEffect(() => {
    const fetchProfile = async () => {
      // Only proceed with API call if authentication context has loaded and user is authenticated
      if (!isAuthenticated || !user) {
        setLoadingProfile(false); // If not authenticated, stop local loading state
        return;
      }

      try {
        setLoadingProfile(true); // Start loading indicator for profile fetch
        // API call to fetch user's detailed profile. Authorization header is handled by axios interceptor.
        const res = await API.get("/user/profile"); // Removed explicit type the API response

        // Populate form data with fetched user details
        setFormData({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          password: "", // Password field is intentionally left blank for security
        });
      } catch (error) { // Removed type annotation : any
        // Catch block for API errors
        console.error("Fetch Profile Error:", error); // Log the full error for debugging
        toast.error(
          error.response?.data?.message || "Failed to load profile details."
        );

        // If the server responds with a 401 (Unauthorized) status, it often means the token is expired/invalid
        if (error.response?.status === 401) {
          logout(); // Call logout from AuthContext to clear local storage and context
          navigate("/login"); // Redirect to login page
        }
      } finally {
        setLoadingProfile(false); // Stop loading indicator after API call completes (success or failure)
      }
    };

    // Only fetch if AuthContext has finished its initial loading phase
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, isAuthenticated, user, logout, navigate]); // Dependencies for fetching profile

  // --- Handle form input changes ---
  const handleChange = (e) => { // Removed type annotation : ChangeEvent<HTMLInputElement>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // --- Handle profile update submission ---
  const handleUpdate = async (e) => { // Removed type annotation : FormEvent
    e.preventDefault(); // Prevent default form submission behavior
    setUpdatingProfile(true); // Start loading indicator for update button

    try {
      // Create an object with only the fields intended for update
      // Email is typically updated via a separate, more secure process (e.g., email verification)
      const updateData = { // Removed type annotation: Partial<{ name: string; password: string }>
        name: formData.name,
      };
      if (formData.password) {
        // Only include password in payload if user entered a new one
        updateData.password = formData.password;
      }

      // API call to update user profile.
      const res = await API.put(
        "/user/putprofile",
        updateData
      ); // Removed type annotation: <{ message: string; user: User }>
      toast.success(res.data.message || "Profile updated successfully!");

      // Clear the password field after a successful update for security
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

      // If AuthContext has a setUser function, update the global user context
      // This is crucial for Navbar and other components to reflect immediate changes like name
      if (setUser && res.data.user) {
        setUser(res.data.user);
      }
    } catch (error) { // Removed type annotation : any
      // Catch block for API errors during update
      console.error("Update Profile Error:", error); // Log the full error for debugging
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setUpdatingProfile(false); // Stop loading indicator for update button
    }
  };

  // --- Handle user logout ---
  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    toast.info("You have been logged out.", { autoClose: 3000 });
    navigate("/"); // Redirect to homepage after logout
  };

  // --- Conditional Rendering for Loading States ---
  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <FaSpinner className="animate-spin text-5xl text-indigo-700 mx-auto mb-4" />{" "}
          <p className="text-xl text-gray-700 font-semibold">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // --- Safeguard for unauthenticated access (though useEffect handles redirection) ---
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 text-lg font-semibold">
            Access Denied. Please log in.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // --- Main User Profile Content ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          {/* User Avatar */}
          <img
            className="h-28 w-28 rounded-full mx-auto object-cover border-4 border-indigo-500 shadow-md transform hover:scale-105 transition-transform duration-300"
            src={
              user.profilePicture ||
              `https://placehold.co/150x150/667EEA/FFFFFF?text=${user.name
                .charAt(0)
                .toUpperCase()}`
            }
            alt={`${user.name}'s avatar`}
          />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            {user.name}
          </h2>
          <p className="text-md text-indigo-600 capitalize">{user.role}</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <FaUser className="inline-block mr-2 text-indigo-500" /> Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Input (Disabled for direct edit) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <FaEnvelope className="inline-block mr-2 text-indigo-500" /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 bg-gray-50 cursor-not-allowed sm:text-base"
              value={formData.email}
              disabled // Email is typically disabled for direct edit
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed directly from here.
            </p>
          </div>

          {/* New Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <FaLock className="inline-block mr-2 text-indigo-500" /> New
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
            <p className="mt-1 text-xs text-gray-500">
              Only fill this if you want to change your password.
            </p>
          </div>

          {/* Update Profile Button */}
          <button
            type="submit"
            disabled={updatingProfile}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updatingProfile ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Update Profile
              </>
            )}
          </button>
        </form>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;