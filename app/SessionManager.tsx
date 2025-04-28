"use client"; // This must be a client component
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

declare global {
  interface Window {
    inactivityTimeout: NodeJS.Timeout;
  }
}

const TAB_COUNT_KEY = "tab_count";
const SESSION_ACTIVE_KEY = "sessionActive";
const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes inactivity timeout

const useSessionManagement = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Logout function to end session and redirect
    const logoutUser = () => {
      signOut({ callbackUrl: "/login" });
      localStorage.removeItem(SESSION_ACTIVE_KEY);
    };

    // Reset inactivity timer
    const resetInactivityTimer = () => {
      clearTimeout(window.inactivityTimeout);
      window.inactivityTimeout = setTimeout(logoutUser, INACTIVITY_LIMIT);
    };

    // Initialize tab count and session activity
    const initializeSessionTracking = () => {
      if (pathname !== "/login") return;
      // Avoid multiple increments on page reloads
      if (!sessionStorage.getItem("tab_initialized")) {
        // Increment global tab count
        const currentTabCount =
          parseInt(localStorage.getItem(TAB_COUNT_KEY) || "0", 10) + 1;
        localStorage.setItem(TAB_COUNT_KEY, currentTabCount.toString());

        // Mark as initialized for this tab
        sessionStorage.setItem("tab_initialized", "true");

        // Set session as active if it’s the first tab
        if (currentTabCount === 1) {
          localStorage.setItem(SESSION_ACTIVE_KEY, "true");
        }
      }
      // Set up inactivity listener
      resetInactivityTimer();
    };

    // // Handle tab visibility changes (e.g., tab switching or closing)
    // const handleVisibilityChange = () => {
    //   if (
    //     document.visibilityState === "hidden" &&
    //     router.pathname !== "/login"
    //   ) {
    //     const updatedTabCount =
    //       (parseInt(localStorage.getItem(TAB_COUNT_KEY) || "1", 10) || 1) - 1;
    //     localStorage.setItem(TAB_COUNT_KEY, updatedTabCount.toString());

    //     // If there are no remaining tabs, clear session and log out
    //     if (updatedTabCount === 0) {
    //       logoutUser();
    //     }
    //   }
    // };

    // Handle tab closing
    const handleTabClose = () => {
      if (pathname === "/login") return; // Exclude "/login" tab closure impact

      const updatedTabCount =
        (parseInt(localStorage.getItem(TAB_COUNT_KEY) || "1", 10) || 1) - 1;
      localStorage.setItem(TAB_COUNT_KEY, updatedTabCount.toString());

      if (updatedTabCount === 0) {
        document.cookie =
          "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "__Secure-next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        logoutUser();
      }
    };

    // Initialize session and track visibility
    initializeSessionTracking();

    // Attach event listeners
    // document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleTabClose);
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    // Clean up on component unmount
    return () => {
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleTabClose);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      clearTimeout(window.inactivityTimeout as NodeJS.Timeout);
    };
  }, [pathname]);
};

export default useSessionManagement;
