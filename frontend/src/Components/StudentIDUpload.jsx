import { useState, useRef } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUpload, 
  faSpinner, 
  faCheckCircle, 
  faExclamationTriangle,
  faIdCard,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../config/api";

export default function StudentIDUpload({ onUploadSuccess, verificationStatus }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar("Please select an image file", { variant: "error" });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("File size must be less than 5MB", { variant: "error" });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      enqueueSnackbar("Please select a file first", { variant: "error" });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('studentId', selectedFile);

    try {
      const response = await axios.post(
        API_ENDPOINTS.uploadStudentID,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      enqueueSnackbar(response.data.msg, { variant: "success" });
      setSelectedFile(null);
      setPreview(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.msg || "Upload failed",
        { variant: "error" }
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusMessage = () => {
    if (verificationStatus?.studentIdVerified) {
      return {
        type: "success",
        icon: faCheckCircle,
        message: "Student ID verified! You have a verified badge.",
        color: "text-green-600"
      };
    } else if (verificationStatus?.studentIdUploaded) {
      return {
        type: "warning",
        icon: faSpinner,
        message: "Student ID uploaded. Waiting for admin verification...",
        color: "text-yellow-600"
      };
    } else {
      return {
        type: "info",
        icon: faIdCard,
        message: "Upload your KNUST student ID for verification",
        color: "text-blue-600"
      };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faIdCard} className="text-green-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">
          Student ID Verification
        </h3>
      </div>

      {/* Status Display */}
      <div className={`flex items-center p-3 rounded-lg mb-4 ${
        status.type === "success" ? "bg-green-50 border border-green-200" :
        status.type === "warning" ? "bg-yellow-50 border border-yellow-200" :
        "bg-blue-50 border border-blue-200"
      }`}>
        <FontAwesomeIcon 
          icon={status.icon} 
          className={`mr-2 ${status.color}`}
          spin={status.type === "warning"}
        />
        <span className={`text-sm font-medium ${status.color}`}>
          {status.message}
        </span>
      </div>

      {/* Upload Section - Only show if not verified */}
      {!verificationStatus?.studentIdVerified && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            
            {!selectedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              >
                <FontAwesomeIcon icon={faUpload} className="text-gray-400 text-3xl mb-2" />
                <p className="text-gray-600 font-medium">
                  Click to upload your student ID
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-32 object-cover rounded border"
                  />
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition"
                  >
                    <FontAwesomeIcon icon={showPreview ? faEyeSlash : faEye} />
                  </button>
                </div>
                
                {showPreview && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-2xl max-h-full">
                      <img
                        src={preview}
                        alt="Full Preview"
                        className="max-w-full max-h-full object-contain rounded"
                      />
                      <button
                        onClick={() => setShowPreview(false)}
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                      >
                        <FontAwesomeIcon icon={faEyeSlash} />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center"
                  >
                    {uploading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Uploading...
                      </>
                    ) : (
                      "Upload ID"
                    )}
                  </button>
                  <button
                    onClick={handleRemoveFile}
                    disabled={uploading}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">Upload Guidelines:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Upload a clear photo of your KNUST student ID</li>
                  <li>• Make sure your name and student number are visible</li>
                  <li>• The image should be well-lit and in focus</li>
                  <li>• Your ID will be securely stored and only visible to admins</li>
                  <li>• Verification typically takes 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Status Details */}
      {verificationStatus?.studentIdVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Verification Complete
            </span>
          </div>
          <p className="text-sm text-green-700">
            Your student ID has been verified by our admin team. You now have a verified badge on your profile!
          </p>
        </div>
      )}
    </div>
  );
}
