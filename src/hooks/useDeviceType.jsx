import { useState, useEffect } from "react";

const useDeviceType = () => {
  const [device, setDevice] = useState("Other");

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent || "";
      if (/Android/i.test(userAgent)) setDevice("Android");
      else if (/iPhone|iPad|iPod/i.test(userAgent)) setDevice("iOS");
      else setDevice("Other");
    }
  }, []);

  return device;
};

export default useDeviceType;
