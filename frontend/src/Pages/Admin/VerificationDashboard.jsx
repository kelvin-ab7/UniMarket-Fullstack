import { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSpinner, 
  faCheckCircle, 
  faTimes, 
  faEye,
  faEyeSlash,
  faShieldAlt
} from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS, UPLOADS_URL } from "../../config/api";
import NavBar from "../../Components/NavBar";
import Footer from "../../Components/Footer";

export default function VerificationDashboard() {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.getPendingVerifications,
        { withCredentials: true }
      );
      setPendingVerifications(response.data);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.msg || "Failed to fetch pending verifications",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (userId, verified) => {
    setVerifying(prev => ({ ...prev, [userId]: true }));
    
    try {
      const response = await axios.post(
        API_ENDPOINTS.verifyStudentID,
        { userId, verified },
        { withCredentials: true }
      );

      enqueueSnackbar(response.data.msg, { variant: "success" });
      
      // Remove from pending list
      setPendingVerifications(prev => 
        prev.filter(user => user._id !== userId)
      );
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.msg || "Verification failed",
        { variant: "error" }
      );
    } finally {
      setVerifying(prev => ({ ...prev, [userId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-secondary-100 min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-green-500" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-secondary-100 min-h-screen">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FontAwesomeIcon icon={faShieldAlt} className="text-green-500 mr-3 text-2xl" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Student ID Verification Dashboard</h1>
              <p className="text-gray-600">Review and verify student ID submissions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{pendingVerifications.length}</div>
              <div className="text-sm text-blue-800">Pending Verifications</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {pendingVerifications.filter(u => new Date(u.createdAt) < new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-yellow-800">Over 24 Hours</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {pendingVerifications.filter(u => new Date(u.createdAt) < new Date(Date.now() - 48 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-green-800">Over 48 Hours</div>
            </div>
          </div>
        </div>

        {pendingVerifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-4xl mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Pending Verifications</h2>
            <p className="text-gray-600">All student ID submissions have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingVerifications.map((user) => (
              <div key={user._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.username}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <p className="text-gray-500 text-xs">
                      Submitted: {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedImage(user.studentIdImage)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                      title="View ID"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleVerification(user._id, true)}
                    disabled={verifying[user._id]}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center"
                  >
                    {verifying[user._id] ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleVerification(user._id, false)}
                    disabled={verifying[user._id]}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center"
                  >
                    {verifying[user._id] ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={`${UPLOADS_URL}/student-ids/${selectedImage}`}
              alt="Student ID"
              className="max-w-full max-h-full object-contain rounded"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
            >
              <FontAwesomeIcon icon={faEyeSlash} />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
