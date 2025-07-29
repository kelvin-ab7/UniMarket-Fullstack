import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLinkedin,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="backdrop-blur-md bg-white/10 border-t border-white/20 text-gray-400 py-10 mt-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
        {/* Categories */}
        <div>
          <h4 className="text-green-400 font-semibold text-lg mb-3">Categories</h4>
          <ul className="space-y-1">
            {[
              "clothes",
              "electronics",
              "food",
              "home-appliances",
              "services",
              "software",
              "student-needs",
              "others",
            ].map((path) => (
              <li key={path}>
                <Link
                  to={`/${path}`}
                  className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:pl-2 block"
                >
                  {path
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-green-400 font-semibold text-lg mb-3">Company</h4>
          <ul className="space-y-1 mb-4">
            <li>
              <Link
                to="/about"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:pl-2 block"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:pl-2 block"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:pl-2 block"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>

          <h4 className="text-green-400 font-semibold text-lg mb-2">Social</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.facebook.com/"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:pl-2 block"
              >
                <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:pl-2 block"
              >
                <FontAwesomeIcon icon={faInstagram} className="mr-2" />
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.twitter.com/"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:pl-2 block"
              >
                <FontAwesomeIcon icon={faXTwitter} className="mr-2" />
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/"
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:pl-2 block"
              >
                <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Branding / Optional Newsletter */}
        <div className="hidden lg:block">
          <h4 className="text-green-400 font-semibold text-lg mb-3">Stay Connected</h4>
          <p className="text-gray-300 mb-2">
            Join our student marketplace and never miss a good deal!
          </p>
          <p className="text-sm text-gray-300 mt-6">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}