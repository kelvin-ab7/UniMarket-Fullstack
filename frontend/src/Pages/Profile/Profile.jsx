import { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Components
import NavBar from "../../Components/NavBar";
import NoProductImage from "../../assets/No data.gif";
import { formatCreationTime } from "../../Components/extractTime";
import StudentIDUpload from "../../Components/StudentIDUpload";
import VerificationBadge from "../../Components/VerificationBadge";
import VendorBadge from "../../Components/VendorBadge";
import { API_ENDPOINTS } from "../../config/api";

export default function Profile() {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3005/user/get-profile", {
          withCredentials: true,
        });
        setUser(res.data);
        console.log("Initial profile load:", res.data);
      } catch (error) {
        enqueueSnackbar(error.response.data.msg, { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [enqueueSnackbar]);

  // Add a useEffect that runs when the component mounts to force refresh
  useEffect(() => {
    // Force refresh on mount to ensure we have the latest data
    const timer = setTimeout(() => {
      forceRefreshProfile();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Add a more aggressive refresh when the component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page became visible, refreshing profile...");
        forceRefreshProfile();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Refresh profile data when location changes (e.g., returning from edit page)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3005/user/get-profile", {
          withCredentials: true,
        });
        setUser(res.data);
        setRefreshKey(prev => prev + 1); // Force re-render
      } catch (error) {
        console.log("Failed to refresh profile:", error);
      }
    };
    fetchProfile();
  }, [location.pathname]);

  // Add a focus event listener to refresh profile data when returning from edit page
  useEffect(() => {
    const handleFocus = () => {
      refreshProfile();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.getVerificationStatus, {
          withCredentials: true,
        });
        setVerificationStatus(res.data.user);
      } catch (error) {
        console.log("Failed to fetch verification status:", error);
      }
    };
    fetchVerificationStatus();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3005/user/seller-products",
          {
            withCredentials: true,
          }
        );
        setProducts(res.data);
      } catch (error) {
        enqueueSnackbar(error.response.data.msg, { variant: "error" });
      }
    };
    fetchProducts();
  }, [enqueueSnackbar, navigate]);

  const refreshProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3005/user/get-profile", {
        withCredentials: true,
      });
      setUser(res.data);
      setRefreshKey(prev => prev + 1);
      console.log("Profile refreshed successfully:", res.data);
    } catch (error) {
      console.log("Failed to refresh profile:", error);
    }
  };

  // Add a more aggressive refresh mechanism
  const forceRefreshProfile = async () => {
    try {
      // Clear any cached data
      setUser({});
      setRefreshKey(0);
      
      // Fetch fresh data
      const res = await axios.get("http://localhost:3005/user/get-profile", {
        withCredentials: true,
      });
      setUser(res.data);
      setRefreshKey(prev => prev + 1);
      console.log("Profile force refreshed:", res.data);
    } catch (error) {
      console.log("Failed to force refresh profile:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3005/user/delete-product/${currentProductId}`,
        {
          withCredentials: true,
        }
      );
      enqueueSnackbar(`Product deleted successfully.`, {
        variant: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setIsModalOpen(false);
    } catch (error) {
      enqueueSnackbar("Failed to delete the product", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavBar />
        <div className="w-full pt-20 pb-10 profile-container">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavBar />
        <div className="w-full pt-20 pb-10 profile-container">
          <div className="md:grid grid-cols-3 xl:grid-cols-4 mx-4 sm:mx-10 gap-10">
            {/* Profile Card */}
            <div className="p-6 md:min-h-[33rem] bg-white rounded-3xl mb-5 shadow-lg border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-600 bg-gradient-to-r from-blue-100 to-purple-100 shadow-lg">
                                         {user.image !== "" ? (
                       <img
                         key={`${user.image}-${refreshKey}-${Date.now()}`}
                         src={`http://localhost:3005/uploads/${user.image}?t=${Date.now()}&v=${refreshKey}`}
                         alt="Profile"
                         className="w-32 h-32 md:w-40 md:h-40 object-cover"
                         onError={(e) => {
                           console.log("Image failed to load:", e.target.src);
                           // Force reload on error
                           setTimeout(() => {
                             e.target.src = `http://localhost:3005/uploads/${user.image}?t=${Date.now()}&v=${refreshKey + 1}`;
                           }, 100);
                         }}
                       />
                     ) : (
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-32 h-32 md:w-40 md:h-40 text-gray-400 p-4"
                      />
                    )}
                  </div>
                </div>
              </div>
              
                             <div className="text-center mt-6">
                 <h2 className="text-xl font-bold text-gray-800 mb-2">
                   {user.username}
                 </h2>
                 <button
                   onClick={forceRefreshProfile}
                   className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                 >
                   Refresh Profile
                 </button>
                                 {verificationStatus && (
                   <div className="mb-4 space-y-2">
                     <VerificationBadge 
                       status={
                         verificationStatus.studentIdVerified ? "verified" :
                         verificationStatus.studentIdUploaded ? "pending" : "unverified"
                       }
                       size="md"
                     />
                     {user.vendorBadge && user.vendorBadge !== 'none' && (
                       <VendorBadge badge={user.vendorBadge} size="md" />
                     )}
                   </div>
                 )}
              </div>
              
              {/* Contact Information */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm font-medium">{user.phone ? `0${user.phone}` : "No phone number"}</span>
                </div>
              </div>
              
              {/* Bio Section */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  About Me
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                  {user.bio || "No bio added yet"}
                </p>
              </div>
              
              {/* Student ID Verification Section */}
              <div className="mt-6">
                <StudentIDUpload 
                  verificationStatus={verificationStatus}
                  onUploadSuccess={() => {
                    const fetchVerificationStatus = async () => {
                      try {
                        const res = await axios.get(API_ENDPOINTS.getVerificationStatus, {
                          withCredentials: true,
                        });
                        setVerificationStatus(res.data.user);
                      } catch (error) {
                        console.log("Failed to fetch verification status:", error);
                      }
                    };
                    fetchVerificationStatus();
                  }}
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="col-span-2 xl:col-span-3 bg-white rounded-3xl shadow-lg border border-gray-100 max-md:pb-5">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                  My Products
                </h2>
                <p className="text-gray-600 text-center mt-2">Manage your marketplace listings</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="max-w-md mx-auto">
                        <img src={NoProductImage} alt="No Product" className="mx-auto max-w-xs mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No products yet</h3>
                        <p className="text-gray-500 mb-4">Start selling by adding your first product to the marketplace</p>
                                                 <Link to="/sell" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Product
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
                    >
                      <div className="relative">
                        <img
                          src={`http://localhost:3005/uploads/${product.image}`}
                          alt="Product"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                          {product.category}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-2xl font-bold text-blue-600 mb-3">
                          GH&#8373; {Number(product.price).toFixed(2)}
                        </p>
                        
                        <div className="space-y-1 mb-4">
                          <p className="text-gray-500 text-xs flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Created: {formatCreationTime(product.createdAt)}
                          </p>
                          <p className="text-gray-500 text-xs flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Updated: {formatCreationTime(product.updatedAt)}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2 mb-4">
                          <Link to={`/view-items/${product._id}`} className="flex-1">
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                              View Details
                            </button>
                          </Link>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <Link
                            to={`/edit-items/${product._id}`}
                            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setCurrentProductId(product._id);
                              setIsModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete} 
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
