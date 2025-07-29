import { useState } from "react";
import axios from "axios";
import { CompanyName, Logo } from "../Components/Default";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMessage,
  faSearch,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";

import { useAuthContext } from "./authContext";

function Nav() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { auth, setAuth } = useAuthContext();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3005/account/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("auth");
      setAuth(null);
      navigate("/login");
    } catch (error) {
      enqueueSnackbar(error.response.data.msg, { variant: "error" });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 text-white">
      <nav className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-7 h-7" />
          <span className="text-xl font-semibold tracking-wide">{CompanyName}</span>
        </Link>

        {/* Navigation Buttons */}
        <ul className="flex gap-3 md:gap-5 items-center text-sm font-medium">
          <li>
            <Link to="/" className="group relative">
              <FontAwesomeIcon
                icon={faHome}
                className="p-2 rounded-xl hover:bg-white/20 transition border border-white/20"
              />
              <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link to="/search" className="group relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="p-2 rounded-xl hover:bg-white/20 transition border border-white/20"
              />
              <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Search
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/sell"
              className="px-4 py-2 rounded-xl bg-green-500 hover:bg-white hover:text-green-500 text-white border border-white transition"
            >
              Sell
            </Link>
          </li>
          <li>
            <Link to="/messages" className="group relative">
              <FontAwesomeIcon
                icon={faMessage}
                className="p-2 rounded-xl hover:bg-white/20 transition border border-white/20"
              />
              <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Messages
              </span>
            </Link>
          </li>
          <li>
            <button onClick={() => setOpen((prev) => !prev)} className="group relative">
              <FontAwesomeIcon
                icon={faUser}
                className="p-2 rounded-xl hover:bg-white/20 transition border border-white/20"
              />
              <span className="absolute text-xs px-2 py-1 bg-black text-white rounded-md top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                Profile
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Dropdown Menu */}
      {!open && (
        <ul className="absolute right-6 mt-2 w-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg text-sm text-white overflow-hidden z-50">
          <li className="hover:bg-white/20 transition">
            <Link to="/profile" className="block px-4 py-2">Profile</Link>
          </li>
          <li className="hover:bg-white/20 transition">
            <Link to="/edit-profile" className="block px-4 py-2">Settings</Link>
          </li>
          <li className="hover:bg-white/20 transition">
            <button onClick={handleLogout} className="w-full text-left px-4 py-2">
              {auth ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Nav;
