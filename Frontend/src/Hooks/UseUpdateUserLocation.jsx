import axios from "axios";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket.js";
const UseUpdateUserLocation = () => {
  const { userData } = useSelector((state) => state.user);
 const url = import.meta.env.VITE_SERVER_URL;
  const lastCallTime = useRef(0);

  useEffect(() => {
    if (!userData) return;

    let watchId;

    const updateLocation = async (lat, lng) => {
      const now = Date.now();

      // 🔥 throttle (3 sec)
      if (now - lastCallTime.current < 3000) return;

      lastCallTime.current = now;
      socket.on('updateLocation', async ({ userId, longitude, latitude }) => {
        try {
          await axios.post(
            `${url}/api/user/update-location`,
            { latitude: lat || latitude, longitude: lng || longitude},
            { withCredentials: true }
          );
        } catch (err) {
          console.log("location update error", err.message);
        }
      })

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
          maximumAge: 5000,
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