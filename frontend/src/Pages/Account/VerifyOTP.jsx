import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { CompanyName, Logo } from "../../Components/Default";
import { API_ENDPOINTS } from "../../config/api";

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Get userId and email from URL params (for signup flow)
  useEffect(() => {
    const urlUserId = searchParams.get('userId');
    const urlEmail = searchParams.get('email');
    
    if (urlUserId) setUserId(urlUserId);
    if (urlEmail) setEmail(decodeURIComponent(urlEmail));
  }, [searchParams]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!userId || !OTP) {
      enqueueSnackbar("Please enter the OTP code", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.verifyOTP, {
        userId,
        otp: OTP,
      }, { withCredentials: true });

      if (res.data.status === "verified") {
        enqueueSnackbar("Email verified successfully! You can now login.", { variant: "success" });
        navigate("/login");
      } else {
        enqueueSnackbar(res.data.message || "Verification successful", { variant: "success" });
        navigate("/login");
      }
    } catch (error) {
      console.log("ERROR: ", error.response?.data?.message);
      enqueueSnackbar(error.response?.data?.message || "OTP verification failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userId || !email) {
      enqueueSnackbar("Missing user information", { variant: "error" });
      return;
    }

    setResendLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.resendOTP, {
        userId,
        email,
      }, { withCredentials: true });

      if (res.data.status === "pending") {
        enqueueSnackbar("OTP resent successfully! Please check your email.", { variant: "success" });
      } else {
        enqueueSnackbar(res.data.message || "OTP resent", { variant: "success" });
      }
    } catch (error) {
      console.log("ERROR: ", error.response?.data?.message);
      enqueueSnackbar(error.response?.data?.message || "Failed to resend OTP", { variant: "error" });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col max-sm:justify-center max-sm:items-center w-screen h-screen">
        <div className="flex items-center justify-center mb-5 sm:my-10">
          <h1 className="text-lg md:text-xl mr-2">{CompanyName}</h1>
          <img src={Logo} alt="Logo" className="w-10 md:w-16" />
        </div>
        <form
          onSubmit={handleVerifyOTP}
          className="flex flex-col items-center justify-center w-screen"
        >
          <div className="my-5 w-8/12 md:w-1/2 xl:w-1/3">
            <h2 className="text-center text-lg font-semibold mb-4">Email Verification</h2>
            {email && (
              <p className="text-center text-sm text-gray-600 mb-4">
                Enter the OTP sent to: <strong>{email}</strong>
              </p>
            )}
          </div>
          <div className="my-5 w-8/12 md:w-1/2 xl:w-1/3">
            <input
              className="loginInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              disabled={!!searchParams.get('email')}
            />
          </div>
          <div className="my-5 w-8/12 md:w-1/2 xl:w-1/3">
            <input
              className="loginInput"
              type="text"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter 4-digit OTP"
              maxLength="4"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btnSubmit"
            disabled={loading || !OTP}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          
          {userId && email && (
            <button 
              type="button" 
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="mt-3 text-blue-500 hover:text-blue-700 underline"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </form>
        <div className="flex justify-between items-center w-8/12 md:w-1/2 xl:w-1/3 mx-auto mt-4">
          <Link
            to="/login"
            className="bg-red-400 text-white py-1 px-3 rounded-lg hover:bg-red-300 transition duration-300 ease-in-out active:bg-primary-500 "
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-red-400 text-white py-1 px-3 rounded-lg hover:bg-red-300 transition duration-300 ease-in-out active:bg-primary-500"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
