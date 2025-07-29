import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders,
  faTimes,
  faArrowUpAZ,
  faArrowDownZA,
  faArrowDownShortWide,
  faArrowDownWideShort,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

// Components
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

export default function Search() {
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [searchMode, setSearchMode] = useState("all");
  const [category, setCategory] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

const handleAllSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://student-business-1-0-backend.vercel.app/user/search-product?query=${query}`,
        { withCredentials: true }
      );
      setProducts(res.data);
      setSortedProducts(res.data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.msg || "Search failed", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const handleSearchByTitle = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://student-business-1-0-backend.vercel.app/user/search-by-title?query=${query}`,
        { withCredentials: true }
      );
      setProducts(res.data);
      setSortedProducts(res.data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.msg || "Search failed", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const handleSearchByLocation = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://student-business-1-0-backend.vercel.app/user/search-by-location?query=${query}`,
        { withCredentials: true }
      );
      setProducts(res.data);
      setSortedProducts(res.data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.msg || "Search failed", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const handleSearchByCategory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://student-business-1-0-backend.vercel.app/user/search-by-categoryandtitle?category=${category}&title=${query}`,
        { withCredentials: true }
      );
      setProducts(res.data);
      setSortedProducts(res.data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.msg || "Search failed", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const handleSearchByPriceRange = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://student-business-1-0-backend.vercel.app/user/search-by-price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`,
        { withCredentials: true }
      );
      setProducts(res.data);
      setSortedProducts(res.data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.msg || "Search failed", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const handleFilter = () => {
    switch (searchMode) {
      case "title":
        handleSearchByTitle();
        break;
      case "location":
        handleSearchByLocation();
        break;
      case "category":
        handleSearchByCategory();
        break;
      case "price":
        handleSearchByPriceRange();
        break;
      default:
        handleAllSearch();
    }
  };

  const sortProductsByNameInAscendingOrder = () => {
    const sorted = [...products].sort((a, b) => a.title.localeCompare(b.title));
    setSortedProducts(sorted);
  };

  const sortProductsByNameInDescendingOrder = () => {
    const sorted = [...products].sort((a, b) => b.title.localeCompare(a.title));
    setSortedProducts(sorted);
  };

  const sortProductsByPriceInAscendingOrder = () => {
    const sorted = [...products].sort((a, b) => a.price - b.price);
    setSortedProducts(sorted);
  };

  const sortProductsByPriceInDescendingOrder = () => {
    const sorted = [...products].sort((a, b) => b.price - a.price);
    setSortedProducts(sorted);
  };

  const handleClear = () => {
    setQuery("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setProducts([]);
    setSortedProducts([]);
    setSearchMode("all");
  };

  return (
    <div className="bg-secondary-100 min-h-screen text-white">
      <NavBar />

      <section
        className="flex flex-col justify-center items-center w-full bg-cover bg-center bg-no-repeat py-40 px-4 text-white backdrop-blur-md"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="w-full max-w-3xl">
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {searchMode !== "price" ? (
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full md:w-2/3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md focus:outline-none shadow-sm"
              />
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-sm"
                />
              </div>
            )}
            <button
              onClick={handleFilter}
              className="px-6 py-2 rounded-full bg-green-400 hover:bg-green-500 text-white transition shadow-md"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition shadow-md"
            >
              Clear
            </button>
          </div>
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            <button onClick={() => setSearchMode("title")} className={`px-4 py-1 rounded-full ${searchMode === "title" ? "bg-green-400 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}>Title</button>
            <button onClick={() => setSearchMode("location")} className={`px-4 py-1 rounded-full ${searchMode === "location" ? "bg-green-400 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}>Location</button>
            <button onClick={() => setSearchMode("category")} className={`px-4 py-1 rounded-full ${searchMode === "category" ? "bg-green-400 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}>Category</button>
            <button onClick={() => setSearchMode("price")} className={`px-4 py-1 rounded-full ${searchMode === "price" ? "bg-green-400 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}>Price</button>
            <button onClick={() => setSearchMode("all")} className="px-4 py-1 rounded-full bg-white/10 text-white hover:bg-white/20">All</button>
          </div>
        </div>
        {loading && <FontAwesomeIcon icon={faSpinner} spin size="2x" className="mt-6" />}
      </section>

      <section className="px-6 py-10">
        <div className="flex justify-center gap-4 mb-6">
          <FontAwesomeIcon icon={faArrowUpAZ} className="cursor-pointer hover:text-green-400" onClick={sortProductsByNameInAscendingOrder} />
          <FontAwesomeIcon icon={faArrowDownZA} className="cursor-pointer hover:text-green-400" onClick={sortProductsByNameInDescendingOrder} />
          <FontAwesomeIcon icon={faArrowDownShortWide} className="cursor-pointer hover:text-green-400" onClick={sortProductsByPriceInAscendingOrder} />
          <FontAwesomeIcon icon={faArrowDownWideShort} className="cursor-pointer hover:text-green-400" onClick={sortProductsByPriceInDescendingOrder} />
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {sortedProducts.map((product, index) => (
            <Link
              key={index}
              to={`/product/${product._id}`}
              className="bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-lg w-44 h-60 p-2 hover:scale-105 transition hover:shadow-2xl"
            >
              <img
                src={`http://localhost:3005/uploads/${product.image}`}
                alt={product.title}
                className="w-full h-32 object-cover rounded-xl"
              />
              <h3 className="text-sm font-semibold mt-2 truncate">{product.title}</h3>
              <p className="text-green-400 font-medium text-sm">
                GH₵ {Number(product.price).toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
