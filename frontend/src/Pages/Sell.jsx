import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { Logo, CompanyName } from "../Components/Default";
import { useSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faSpinner } from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";

// Components
import NavBar from "../Components/NavBar";

// condition,
// negotiable,

export default function Sell() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categoryOthers, setCategoryOthers] = useState("");
  const [condition, setCondition] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSell = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title || !location || !description || !price || !image || !category || (category === "Others" && !categoryOthers)) {
        enqueueSnackbar("Please fill in all required fields.", { variant: "error" });
        return;
      }
      if (description.length < 30 || description.length > 500) {
        enqueueSnackbar("Description must be between 30 and 500 characters.", { variant: "error" });
        return;
      }
      if (image && image.size > 7 * 1024 * 1024) {
        enqueueSnackbar("Image size should be less than 7MB.", { variant: "error" });
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);
      formData.append("category", category);
      formData.append("categoryOthers", categoryOthers);
      formData.append("condition", condition);
      formData.append("negotiable", negotiable);

      const res = await axios.post(
        "http://localhost:3005/account/post-product",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      enqueueSnackbar(res.data.msg, { variant: "success" });

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.msg || error.message || "Error posting product",
        { variant: "error" }
      );
      // Do not navigate on error
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImagePreview(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    switch (e.target.value) {
      case "Clothes":
        setCategoryInfo("Clothes: Fashionable items for all ages. Include shoes, bags, dress, and accessories.");
        break;
      case "Electronics":
        setCategoryInfo("Electronics: Latest gadgets and devices. Include smartphones, laptops, cameras, and accessories.");
        break;
      case "Food":
        setCategoryInfo("Food: Fresh and delicious food. Include snacks, drinks, and meals.");
        break;
      case "Home Appliances":
        setCategoryInfo("Home Appliances: Useful items for your home. Include furniture, kitchenware, and appliances.");
        break;
      case "Services":
        setCategoryInfo("Services: Offer your skills and expertise. Include tutoring, repair, and consultation.");
        break;
      case "Software":
        setCategoryInfo("Software: Digital products and services. Include apps, games, antivirus, and subscriptions.");
        break;
      case "Student Needs":
        setCategoryInfo("Student Needs: Items for students. Include books, stationery, and gadgets.");
        break;
      case "Others":
        setCategoryInfo("Others: Unique items and services not in listed categories.");
        break;
      default:
        setCategoryInfo("");
    }
  };

  return (
    <div className="bg-secondary-100 min-h-screen text-black">
      <NavBar />

      <section className="flex flex-col justify-center items-center w-full py-20 px-4">
        <h2 className="text-3xl font-bold text-center text-black">Post a Product for Sale</h2>
      </section>

      <form
        onSubmit={handleSell}
        className="w-11/12 md:w-2/3 lg:w-1/2 mx-auto mt-4 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100"
      >
        <div className="space-y-5">

          <div>
            <label className="block text-base font-semibold mb-1 text-green-700">Product Title</label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              type="text"
              placeholder="Product Title"
              value={title}
              onChange={(e) => setTitle(e.target.value.replace(/^(.)/, (c) => c.toUpperCase()))}
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold mb-1 text-green-700">Location</label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value.replace(/^(.)/, (c) => c.toUpperCase()))}
              pattern="^[a-zA-Z\s,]+$"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold mb-1 text-green-700">Product Description</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
              placeholder="Product Description (min 30 chars)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              minLength={30}
              required
            />
            <p className="text-sm text-gray-500 text-right">{description.length}/500 characters</p>
          </div>

          <div>
            <label className="block text-base font-semibold mb-1 text-green-700">Price (GHS)</label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              type="number"
              step="0.01"
              placeholder="Price in GHS"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold mb-1 text-green-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl mt-4 shadow-md border border-gray-200 transition-opacity duration-700 opacity-100"
              />
            )}
          </div>

          <div>
            <label className="block text-base font-semibold mb-1 text-green-700">Select Category</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Clothes">Clothes</option>
              <option value="Electronics">Electronics</option>
              <option value="Food">Food</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Services">Services</option>
              <option value="Software">Software</option>
              <option value="Student Needs">Student Needs</option>
              <option value="Others">Others</option>
            </select>
            {categoryInfo && (
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleInfo} className="text-green-500" /> {categoryInfo}
              </p>
            )}

            {category === "Others" && (
              <input
                className="w-full mt-3 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                type="text"
                placeholder="Custom Category"
                value={categoryOthers}
                onChange={(e) => setCategoryOthers(e.target.value)}
                required
              />
            )}

            {(category === "Clothes" || category === "Electronics" || category === "Home Appliances" || category === "Others") && (
              <select
                className="w-full mt-3 px-4 py-3 rounded-xl border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-base font-semibold mb-1 text-green-700">Are you open to negotiation?</label>
            <div className="flex w-full justify-start space-x-9 mt-1">
              <div>
                <label htmlFor="Yes" className="mr-2 text-base font-medium">Yes</label>
                <input
                  type="radio"
                  id="Yes"
                  name="negotiable"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                />
              </div>
              <div>
                <label htmlFor="No" className="mr-2 text-base font-medium">No</label>
                <input
                  type="radio"
                  id="No"
                  name="negotiable"
                  checked={!negotiable}
                  onChange={(e) => setNegotiable(!e.target.checked)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 shadow-lg text-white font-semibold flex items-center justify-center transition-all duration-200"
            disabled={loading}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : null}
            {loading ? "Posting..." : "Post Product"}
          </button>
        </div>
      </form>

      <div className="h-20" />
    </div>
  );
}
