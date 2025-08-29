import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faBox, 
  faCheckCircle, 
  faClock, 
  faShieldAlt,
  faMedal,
  faChartBar,
  faEye,
  faCheck,
  faTimes,
  faTrash,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

import NavBar from '../../Components/NavBar';
import VendorBadge from '../../Components/VendorBadge';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [badgeModal, setBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('none');
  const [badgeReason, setBadgeReason] = useState('');
  
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, verificationsRes, usersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:3005/admin/dashboard', { withCredentials: true }),
        axios.get('http://localhost:3005/admin/verifications', { withCredentials: true }),
        axios.get('http://localhost:3005/admin/users', { withCredentials: true }),
        axios.get('http://localhost:3005/admin/products', { withCredentials: true })
      ]);

      setDashboardData(dashboardRes.data);
      setPendingVerifications(verificationsRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to load dashboard data';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (userId, approved) => {
    try {
      await axios.post(`http://localhost:3005/admin/verify-student/${userId}`, {
        approved,
        reason: approved ? 'Approved by admin' : 'Rejected by admin'
      }, { withCredentials: true });

      enqueueSnackbar(
        `Student ID ${approved ? 'approved' : 'rejected'} successfully`, 
        { variant: 'success' }
      );
      
      fetchDashboardData();
    } catch (error) {
      console.error('Verification error:', error);
      enqueueSnackbar('Failed to process verification', { variant: 'error' });
    }
  };

  const handleBadgeAssignment = async () => {
    if (!selectedUser) return;

    try {
      await axios.post(`http://localhost:3005/admin/assign-badge/${selectedUser._id}`, {
        badge: selectedBadge,
        reason: badgeReason
      }, { withCredentials: true });

      enqueueSnackbar(`Badge assigned successfully`, { variant: 'success' });
      setBadgeModal(false);
      setSelectedUser(null);
      setSelectedBadge('none');
      setBadgeReason('');
      fetchDashboardData();
    } catch (error) {
      console.error('Badge assignment error:', error);
      enqueueSnackbar('Failed to assign badge', { variant: 'error' });
    }
  };

  const handleBadgeRemoval = async (userId) => {
    try {
      await axios.post(`http://localhost:3005/admin/remove-badge/${userId}`, {}, { withCredentials: true });
      enqueueSnackbar('Badge removed successfully', { variant: 'success' });
      fetchDashboardData();
    } catch (error) {
      console.error('Badge removal error:', error);
      enqueueSnackbar('Failed to remove badge', { variant: 'error' });
    }
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:3005/admin/delete-product/${productId}`, { withCredentials: true });
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
      fetchDashboardData();
    } catch (error) {
      console.error('Product deletion error:', error);
      enqueueSnackbar('Failed to delete product', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavBar />
        <div className="w-full pt-20 pb-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar />
      <div className="w-full pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, verifications, and platform analytics</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Overview', icon: faChartBar },
                { id: 'verifications', label: 'Verifications', icon: faShieldAlt },
                { id: 'users', label: 'Users', icon: faUsers },
                { id: 'products', label: 'Products', icon: faBox }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Verified Users</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.verifiedUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FontAwesomeIcon icon={faBox} className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingVerifications.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verifications Tab */}
          {activeTab === 'verifications' && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pending Student ID Verifications</h2>
                <p className="text-gray-600 mt-1">Review and approve student ID uploads</p>
              </div>
              
              <div className="p-6">
                {pendingVerifications.length === 0 ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No pending verifications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVerifications.map((user) => (
                      <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              {user.studentIdImage ? (
                                <img 
                                  src={`http://localhost:3005/uploads/student-ids/${user.studentIdImage}`}
                                  alt="Student ID"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <FontAwesomeIcon icon={faEye} className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{user.username}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">Uploaded: {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVerification(user._id, true)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerification(user._id, false)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <p className="text-gray-600 mt-1">Manage user accounts and assign vendor badges</p>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.studentIdVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.studentIdVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <VendorBadge badge={user.vendorBadge} size="sm" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSelectedBadge(user.vendorBadge);
                                  setBadgeModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                              </button>
                              {user.vendorBadge !== 'none' && (
                                <button
                                  onClick={() => handleBadgeRemoval(user._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
                <p className="text-gray-600 mt-1">Monitor and manage marketplace products</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img 
                          src={`http://localhost:3005/uploads/${product.image}`}
                          alt={product.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">{product.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">GH₵ {Number(product.price).toFixed(2)}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">by</span>
                          <span className="text-sm font-medium text-gray-900">{product.seller?.username}</span>
                          <VendorBadge badge={product.seller?.vendorBadge} size="sm" />
                        </div>
                        <button
                          onClick={() => handleProductDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badge Assignment Modal */}
      {badgeModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Vendor Badge</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">User: {selectedUser.username}</p>
                <p className="text-sm text-gray-600 mb-4">{selectedUser.email}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Type</label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">No Badge</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                  <option value="diamond">Diamond</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <textarea
                  value={badgeReason}
                  onChange={(e) => setBadgeReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Reason for badge assignment..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setBadgeModal(false);
                    setSelectedUser(null);
                    setSelectedBadge('none');
                    setBadgeReason('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBadgeAssignment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Assign Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
