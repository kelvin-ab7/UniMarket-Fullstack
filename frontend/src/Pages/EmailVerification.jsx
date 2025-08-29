import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../config/api";
import { CompanyName } from "../Components/Default";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

export default function EmailVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!userId || !email) {
      enqueueSnackbar("Invalid verification link", { variant: "error" });
      navigate("/register");
      return;
    }
  }, [userId, email, navigate, enqueueSnackbar]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      enqueueSnackbar("Please enter a 6-digit OTP", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.verifyEmailOTP, {
        userId,
        otp,
      }, { withCredentials: true });

      enqueueSnackbar(response.data.msg, { variant: "success" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.msg || "Verification failed",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.resendOTP, {
        userId,
      }, { withCredentials: true });

      enqueueSnackbar(response.data.msg, { variant: "success" });
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.msg || "Failed to resend OTP",
        { variant: "error" }
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="bg-secondary-100 min-h-screen">
      <NavBar />
      
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              Welcome to <span className="text-green-500 font-semibold">{CompanyName}</span>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Check your email
              </span>
            </div>
            <p className="text-sm text-blue-700">
              We've sent a 6-digit verification code to:
            </p>
            <p className="text-sm font-medium text-blue-800 mt-1">
              {email}
            </p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOTPChange}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                maxLength={6}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={resendLoading || countdown > 0}
              className="text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition duration-200"
            >
              {resendLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                "Resend Code"
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mt-0.5 mr-2" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• The code expires in 10 minutes</li>
                    <li>• Check your spam folder if you don't see it</li>
                    <li>• Make sure you're using your KNUST student email</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
