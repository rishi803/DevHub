import {useState, useEffect} from 'react'

const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(() => {
      // Check if window is defined (client-side) on server window is not available
      if (typeof window !== "undefined") {
        // First try to get from localStorage
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode !== null) {
          return JSON.parse(savedMode);
        }
        // If not in localStorage, check system preference
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return false;
    });
  
    useEffect(() => {
      // Update class on document element
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      // Save to localStorage
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);
  
    return [darkMode, setDarkMode];
  };

  export default useDarkMode;