import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const UseUpdateUserLocation = () => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    let watchId;

    const updateLocation = async (lat, lng) => {
      try {
        await axios.post(
          "http://localhost:8000/api/user/update-location",
          { latitude: lat, longitude: lng },
          { withCredentials: true }
        );

      } catch (err) {
        console.log("location update error", err.message);
      }
    };

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          updateLocation(latitude, longitude);
        },
        (err) => console.log("location error:", err.message),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };

  }, [userData?._id]);
};

export { UseUpdateUserLocation };