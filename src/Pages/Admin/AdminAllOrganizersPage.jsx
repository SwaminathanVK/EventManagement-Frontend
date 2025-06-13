import React, { useEffect, useState } from 'react';
import API from '../../api/axios'; 
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa'; 



const AdminAllOrganizersPage = () => { 
  const [organizers, setOrganizers] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const fetchOrganizers = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await API.get('/admin/organizers'); // Removed explicit type <{ organizers: Organizer[] }>
      setOrganizers(response.data.organizers || []); // Handle potential empty array
    } catch (error) { // Removed type annotation : any
      console.error('Error fetching organizers:', error);
      // Display a more specific error message if available from the backend
      toast.error(error.response?.data?.message || 'Failed to fetch organizers');
    } finally {
      setLoading(false); // Always set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []); // Empty dependency array means this runs once on component mount

  const handleRoleChange = (organizerId) => { // Removed type annotation : string
    toast.info('Role change feature coming soon!');
    // Here you would implement backend call to change role:
    // try {
    //   await API.put(`/admin/organizers/${organizerId}/role`, { newRole: 'new_role_here' });
    //   toast.success('Organizer role updated successfully!');
    //   fetchOrganizers(); // Refresh list
    // } catch (error) {
    //   toast.error('Failed to update role.');
    // }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Organizers</h1>
      {loading ? (
        <div className="flex items-center justify-center text-gray-500 mt-8">
          <FaSpinner className="animate-spin mr-2" size={24} /> Loading organizers...
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
              {organizers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No organizers found.
                  </td>
                </tr>
              ) : (
                organizers.map(org => (
                  <tr key={org._id}>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{org.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{org.email}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900 capitalize">{org.role}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRoleChange(org._id)}
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

export default AdminAllOrganizersPage;