import { useState, useEffect } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { Logo, CompanyName } from "../Components/Default";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCirclePlus,
  faUtensils,
  faBook,
  faShirt,
  faSpinner,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState(4);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3005/account/get-product",
          { withCredentials: true }
        );
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar(error.response.data.msg, { variant: "error" });
        setLoading(false);
      }
    };
    fetchProducts();
  }, [enqueueSnackbar]);

  const categories = [
    { name: "Sell A Product", icon: faCirclePlus, link: "/sell" },
    { name: "Food", icon: faUtensils, link: "/food" },
    { name: "Student Needs", icon: faBook, link: "/student-needs" },
    { name: "Clothes", icon: faShirt, link: "/clothes" },
  ];

  const handleLoadMore = () => {
    setDisplayedProducts((prev) => prev + 4);
  };

  return (
    <div className="bg-secondary-100">
      <NavBar />

      {/* Hero Section */}
      <section className="h-[60vh] bg-cover bg-center text-white flex flex-col items-center justify-center text-center px-4"
  style={{
    backgroundImage:"url('/hero-bg.jpg')",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backgroundBlendMode: "overlay",
  }}
>
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Buy & Sell on Campus Easily
        </h1>
        <p className="text-lg mt-4 max-w-xl">
          Welcome to <span className="text-green-400">{CompanyName}</span>, the trusted student marketplace.
        </p>
        <div className="mt-6 flex gap-4">
          <Link to="/search" className="bg-white text-black px-6 py-2 rounded shadow hover:bg-green-400 hover:text-white transition">
            Explore Products
          </Link>
          <Link to="/sell" className="bg-green-400 text-white px-6 py-2 rounded shadow hover:bg-white hover:text-green-400 transition">
            Start Selling
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10">
        <h2 className="text-center text-xl font-semibold mb-6">Top Categories</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat, idx) => (
            <Link
              to={cat.link}
              key={idx}
              className="w-40 p-5 rounded-xl bg-white/40 text-black hover:bg-green-500 hover:text-white transition shadow-lg"
            >
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={cat.icon} size="2x" />
                <p className="mt-2">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Counter */}
      <section className="text-center py-10 text-white bg-black/30 backdrop-blur-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-3xl font-bold">1200+</h3>
            <p>Items Sold</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">3,200</h3>
            <p>Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">4.9/5</h3>
            <p>Avg Seller Rating</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">24/7</h3>
            <p>Support</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10">
        <h2 className="text-center text-xl font-semibold mb-6 text-black">What Students Say</h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {["Sold my phone in 2 hours!", "Super easy to use.", "Trusted by students!"].map((quote, idx) => (
            <div
              key={idx}
              className="max-w-xs bg-white/10 text-gray-400 p-4 rounded-lg backdrop-blur-md border border-white/10 shadow"
            >
              <FontAwesomeIcon icon={faStar} className="text-yellow-300 mb-2" />
              <p className="italic">“{quote}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-10">
        <h2 className="text-center text-xl font-semibold text-black">Latest Products</h2>
        {loading ? (
          <div className="flex justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-black" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center mt-6 px-4">
            {products.slice(0, displayedProducts).map((product, index) => (
              <Link
                key={index}
                to={`/product/${product.id}`}
                className="bg-white/10 backdrop-blur-md text-white w-44 h-60 p-2 rounded-lg shadow border border-white/10 hover:scale-105 transition"
              >
                <img
                  src={`http://localhost:3005/uploads/${product.image}`}
                  alt="Product"
                  className="w-full h-32 object-cover rounded"
                />
                <h3 className="mt-2 font-semibold text-sm truncate">{product.title}</h3>
                <p className="text-green-400 font-medium text-sm">GH₵ {Number(product.price).toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}
        {displayedProducts < products.length && (
          <div className="text-center mt-6">
            <button
              className="bg-green-400 text-white px-6 py-2 rounded hover:bg-white hover:text-green-400 transition"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
