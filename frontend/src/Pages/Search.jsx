import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import { Search, LoaderCircle } from "lucide-react";
import { API_ENDPOINTS, API_BASE_URL, UPLOADS_URL } from "../config/api";
import VendorBadge from "../Components/VendorBadge";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortType, setSortType] = useState("");
  const [loading, setLoading] = useState(false);



  const handleSearch = async () => {
    try {
      setLoading(true);
      let res;

      switch (searchType) {
        case "title":
          res = await axios.get(API_ENDPOINTS.searchTitle(searchQuery));
          break;
        case "location":
          res = await axios.get(API_ENDPOINTS.searchLocation(locationQuery));
          break;
        case "category":
          res = await axios.get(API_ENDPOINTS.searchCategory(categoryQuery));
          break;
        case "price":
          res = await axios.get(
            `${API_BASE_URL}/search/price?min=${minPrice}&max=${maxPrice}`,
            { withCredentials: true }
          );
          break;
        default:
          res = { data: [] };
      }

      setProducts(res.data);
    } catch (err) {
      console.error("Search failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = () => {
    let sorted = [...products];
    if (sortType === "az") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "za") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortType === "priceLowHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "priceHighLow") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  };

  const sortedProducts = handleSort();

  const handleClear = () => {
    setSearchQuery("");
    setLocationQuery("");
    setCategoryQuery("");
    setMinPrice("");
    setMaxPrice("");
    setProducts([]);
    setSearchType("title");
    setSortType("");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white text-black p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Search Marketplace</h1>

        <div className="max-w-4xl mx-auto bg-gray-200 p-6 rounded-2xl shadow-md space-y-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {["title", "location", "category", "price"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-xl font-medium border ${
                  searchType === type ? "bg-green-500 text-white" : "bg-white text-black"
                }`}
                onClick={() => setSearchType(type)}
              >
                {type[0].toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="flex flex-wrap gap-4 justify-center">
            {searchType === "title" && (
              <input
                type="text"
                placeholder="Enter product title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-xl text-black w-full sm:w-[500px]"
              />
            )}

            {searchType === "location" && (
              <input
                type="text"
                placeholder="Enter location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="px-4 py-2 rounded-xl text-black w-full sm:w-[500px]"
              />
            )}

            {searchType === "category" && (
              <input
                type="text"
                placeholder="Enter category"
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                className="px-4 py-2 rounded-xl text-black w-full sm:w-[500px]"
              />
            )}

            {searchType === "price" && (
              <>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="px-4 py-2 rounded-xl text-black w-36"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="px-4 py-2 rounded-xl text-black w-36"
                />
              </>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 hover:scale-105 transition px-6 py-2 rounded-xl text-white flex items-center gap-2"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : <Search size={18} />}
              {loading ? "Searching..." : "Search"}
            </button>

            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 hover:scale-105 transition px-6 py-2 rounded-xl text-white"
            >
              Clear
            </button>
          </div>

          {/* Sort options */}
          {products.length > 0 && (
            <div className="text-center">
              <select
                className="px-4 py-2 rounded-xl text-black mt-4"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="">Sort</option>
                <option value="az">Title A-Z</option>
                <option value="za">Title Z-A</option>
                <option value="priceLowHigh">Price Low-High</option>
                <option value="priceHighLow">Price High-Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Product List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {sortedProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="bg-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all p-4"
            >
              <div className="relative">
                <img
                  src={`${UPLOADS_URL}/${product.image}`}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                
                {/* Vendor Badge */}
                {product.vendorBadge && product.vendorBadge !== 'none' && (
                  <div className="absolute top-2 left-2">
                    <VendorBadge badge={product.vendorBadge} size="sm" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2 capitalize">{product.title}</h2>
              <p className="text-green-400 font-bold mt-2 text-lg">GH₵{product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>

        {/* No results */}
        {!loading && sortedProducts.length === 0 && (
          <p className="text-center text-black mt-10">No products found.</p>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
