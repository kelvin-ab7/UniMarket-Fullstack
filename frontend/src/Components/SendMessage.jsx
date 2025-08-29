import { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import PropTypes from 'prop-types';
import { API_ENDPOINTS } from "../config/api";

export default function SendMessage({
  receiverId,
  className,
  productId,
  productImage,
}) {
  const [message, setMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const id = receiverId;

  const sendMessage = async () => {
    if (message === "") {
      enqueueSnackbar("Please fill the form", { variant: "error" });
      return;
    }
         try {
       await axios.post(
         API_ENDPOINTS.sendMessage(id),
         {
           to: id,
           message,
           image: productImage,
           link: productId,
         },
         {
           withCredentials: true,
         }
       );
      setMessage("");
      enqueueSnackbar("Message sent", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data.msg, { variant: "error" });
    }
  };

  return (
    <div className={`${className}`}>
      <textarea
        type="text"
        className="flex-1 border border-black h-20 p-2 rounded-lg mr-2"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ resize: "none" }}
      />
      <button
        onClick={sendMessage}
        className="bg-primary-300 text-white p-2 rounded-xl"
      >
        Send
      </button>
    </div>
  );
}

SendMessage.propTypes = {
  receiverId: PropTypes.string.isRequired,
  className: PropTypes.string,
  productId: PropTypes.string,
  productImage: PropTypes.string,
};
