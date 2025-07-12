import React, { useState } from "react";
import { uploadImage } from "../firebaseConfig";
// import { uploadImage } from "./firebase";  // Assuming firebase.js is in the same directory

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setUploading(true);
    try {
      // Call the uploadImage function from firebase.js
      const downloadURL = await uploadImage(image);
      setImageUrl(downloadURL); // Store the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ width: "200px", height: "auto" }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
