import { useState, useEffect } from 'react';
import { BASE_URL } from '../../constants/config';

const ProfileHeader = () => {
  const [userProfile, setUserProfile] = useState(null);
  const defaultAvatar = "https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const response = await fetch(`${BASE_URL}user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="py-4 px-4 flex items-center justify-between bg-white border-b border-gray-200">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img 
            src={userProfile?.image_url || defaultAvatar} 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <h2 className="font-semibold text-gray-800">
            {userProfile?.username || 'My Chat'}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;