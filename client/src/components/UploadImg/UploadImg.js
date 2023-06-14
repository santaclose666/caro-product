import React, { useState } from "react";
import "./UploadImg.css";
import { useSelector } from "react-redux";
import axios from "axios";

const UploadImg = () => {
  const [files, setFiles] = useState(null);
  const fileName = useSelector(
    (state) => state.auth.login?.currentUser.username
  );

  const handleChangeFile = (e) => {
    setFiles(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("file", files);

    try {
      await axios.post("https://tic-tac-toe-server-9jq0.onrender.com/upload", formData, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      window.location.reload(true);
    }, 300);
  };

  return (
    <form
      onSubmit={handleUpload}
      className="cointainerUpload"
      encType="multipart/form-data"
    >
      <input
        type="file"
        accept="image/jpeg, image/png, image/gif"
        onChange={handleChangeFile}
      />
      <button type="submit" className="btnUpload">
        Upload
      </button>
    </form>
  );
};

export default UploadImg;
