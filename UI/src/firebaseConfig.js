// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAh5kAOHv0ETFXBAJGoKd1AssPgnXJTpqY",
    authDomain: "swoplet-f152c.firebaseapp.com",
    projectId: "swoplet-f152c",
    storageBucket: "swoplet-f152c.firebasestorage.app",
    messagingSenderId: "572188084301",
    appId: "1:572188084301:web:11b42242c22521374c3404"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

const uploadImage = async (files) => {
    const imageUrls = [];
  
    for (const file of files) {
      try {
        // Reference for the storage path (you can adjust the path as needed)
        const storageRef = ref(storage, `images/${file.name}`);
        
        // Upload the image file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the download URL for the image
        const downloadURL = await getDownloadURL(snapshot.ref); // Correctly access the ref here
        imageUrls.push(downloadURL); // Add the URL to the array
      } catch (error) {
        console.error("Error uploading image:", error);
        imageUrls.push(null); // Push null for failed uploads
      }
    }
  
    return imageUrls; // Return the array of image URLs (or null if failed)
  };
  
  export { uploadImage };