import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { CompanyName } from "../Components/Default";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMessage,
  faSearch,
  faHome,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useSnackbar } from "notistack";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./authContext";

import logo from "../assets/logo.png";

function Nav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { auth, setAuth } = useAuthContext();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Fetch user data to check if admin
  useEffect(() => {
    if (auth) {
      const fetchUser = async () => {
        try {
          const res = await axios.get("http://localhost:3005/user/get-profile", {
            withCredentials: true,
          });
          setUser(res.data);
        } catch (error) {
          console.log("Failed to fetch user data:", error);
        }
      };
      fetchUser();
    }
  }, [auth]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3005/account/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("auth");
      setAuth(null);
      navigate("/login");
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.msg || "Logout failed",
        { variant: "error" }
      );
    }
  };

  const navLinkClass = "group relative";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-100 border-b border-gray-200 text-gray-900">
      <nav className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to={auth ? "/home" : "/login"} className="flex items-center gap-2">
            {/* ✅ Updated logo usage */}
            <img
              src={logo}
              alt="Student Business Logo"
              className="w-7 h-7"
            />
            <span className="text-xl font-semibold tracking-wide">
              {CompanyName}
            </span>
          </Link>
        </div>

        {/* Navigation Buttons */}
        <ul className="flex gap-3 md:gap-5 items-center text-sm font-medium">
          <li>
            <Link to="/home" className={navLinkClass}>
              <FontAwesomeIcon
                icon={faHome}
                className="p-2 rounded-xl hover:bg-gray-200 transition border border-gray-300"
              />
              <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link to="/search" className={navLinkClass}>
              <FontAwesomeIcon
                icon={faSearch}
                className="p-2 rounded-xl hover:bg-gray-200 transition border border-gray-300"
              />
              <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Search
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/sell"
              className="px-4 py-2 rounded-xl border transition bg-green-500 hover:bg-white hover:text-green-500 text-white border-white"
            >
              Sell
            </Link>
          </li>
          <li>
            <Link to="/messages" className={navLinkClass}>
              <FontAwesomeIcon
                icon={faMessage}
                className="p-2 rounded-xl hover:bg-gray-200 transition border border-gray-300"
              />
              <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Messages
              </span>
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Link to="/admin/dashboard" className={navLinkClass}>
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="p-2 rounded-xl hover:bg-gray-200 transition border border-gray-300 text-red-500"
                />
                <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                  Admin
                </span>
              </Link>
            </li>
          )}
          <li>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="group relative"
              aria-haspopup="true"
              aria-expanded={open}
            >
              <FontAwesomeIcon
                icon={faUser}
                className="p-2 rounded-xl hover:bg-gray-200 transition border border-gray-300"
              />
              <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Profile
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Dropdown Menu */}
      {open && (
        <ul
          ref={dropdownRef}
          className="absolute right-6 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-900 overflow-hidden z-50"
        >
          <li className="hover:bg-gray-100 transition">
            <Link to="/profile" className="block px-4 py-2">
              Profile
            </Link>
          </li>
          <li className="hover:bg-gray-100 transition">
            <Link to="/edit-profile" className="block px-4 py-2">
              Settings
            </Link>
          </li>
          <li className="hover:bg-gray-100 transition">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2"
            >
              {auth ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Nav;