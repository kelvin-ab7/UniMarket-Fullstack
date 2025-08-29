import axios from "axios";
import { CompanyName, Logo } from "../../Components/Default";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faExclamationTriangle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../../config/api";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Email validation for KNUST emails only
  const isKNUSTEmail = email.endsWith("@st.knust.edu.gh") || email.endsWith("@knust.edu.gh");
  const isValidEmail = isKNUSTEmail;
  const emailError = email && !isValidEmail;

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail) {
      enqueueSnackbar("Please use a KNUST email (@knust.edu.gh or @st.knust.edu.gh)", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.register, {
        username: userName,
        email,
        password,
        confirmPassword,
        phone,
      }, { withCredentials: true });

      if (res.data.status === "pending") {
        enqueueSnackbar("Registration successful! Please check your email for OTP verification.", { variant: "success" });
        
        // Redirect to OTP verification page with user data
        navigate(`/verify-otp?userId=${res.data.data.userId}&email=${encodeURIComponent(email)}`);
      } else {
        enqueueSnackbar(res.data.message || "Registration completed", { variant: "success" });
        navigate("/login");
      }
    } catch (error) {
      console.log("ERROR: ", error.response?.data?.msg);
      enqueueSnackbar(error.response?.data?.msg || "Registration failed", { variant: "error" });
    } finally {
      setLoading(false);
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
          onSubmit={handleSignUp}
          className="flex flex-col items-center justify-center w-screen"
        >
          <div className="my-5 w-8/12 md:w-1/2 xl:w-1/3">
            <input
              className="loginInput"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="my-5 w-8/12 md:w-1/2 xl:w-1/3">
            <input
              className={`loginInput ${emailError ? 'border-red-500' : isValidEmail ? 'border-green-500' : ''}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="KNUST Email (@knust.edu.gh or @st.knust.edu.gh)"
              required
            />
            {emailError && (
              <div className="flex items-center mt-1 text-red-500 text-xs">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                Please use a KNUST email address (@knust.edu.gh or @st.knust.edu.gh)
              </div>
            )}
            {isKNUSTEmail && (
              <div className="flex items-center mt-1 text-green-500 text-xs">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                Valid KNUST email address
              </div>
            )}
          </div>
          <div className="my-5 w-8/12 md:w-1/2 xl:w-1/3">
            <input
              className="loginInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="my-5 w-8/12 md:w-1/2 xl:w-1/3 relative">
            <input
              className="loginInput"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <FontAwesomeIcon
              onClick={() => setShowPassword(!showPassword)}
              icon={showPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-2 text-primary-500 hover:text-primary-400 cursor-pointer"
            />
          </div>
          <div className="my-5 w-8/12 md:w-1/2 xl:w-1/3">
            <input
              className="loginInput"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btnSubmit"
            disabled={loading || !isValidEmail}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          <Link to="/login" className="my-5 text-blue-500">
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}
