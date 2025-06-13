import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa'; 



const AdminAllUsersPage = () => { 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const fetchUsers = async () => {
    setLoading(true); 
    try {
      const response = await API.get('/admin/users'); // Removed explicit type <{ users: User[] }>
      setUsers(response.data.users || []); // Handle potential empty array
    } catch (error) { // Removed type annotation : any
      console.error('Error fetching users:', error);
      // Display a more specific error message if available from the backend
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false); // Always set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array means this runs once on component mount

  const handleRoleChange = (userId) => { // Removed type annotation : string
    toast.info('Role change feature coming soon!');
    // Placeholder for future implementation:
    // Here you would implement backend call to change role, e.g.:
    // try {
    //   await API.put(`/admin/users/${userId}/role`, { newRole: 'new_role_here' });
    //   toast.success('User role updated successfully!');
    //   fetchUsers(); // Refresh list after successful update
    // } catch (error) {
    //   toast.error('Failed to update role.');
    // }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      {loading ? (
        <div className="flex items-center justify-center text-gray-500 mt-8">
          <FaSpinner className="animate-spin mr-2" size={24} /> Loading users...
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900 capitalize">{user.role}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRoleChange(user._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAllUsersPage;