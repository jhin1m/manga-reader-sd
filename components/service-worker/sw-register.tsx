"use client";

import { useEffect } from "react";

const DEBUG = process.env.NODE_ENV === "development";

export function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) {
      if (DEBUG) console.log("[SW] Service Worker not supported");
      return;
    }

    // Defer registration to not block initial load
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        if (DEBUG) console.log("[SW] Registered:", registration.scope);

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                if (DEBUG)
                  console.log("[SW] New version available - activating");
                // Auto-activate new service worker
                newWorker.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });

        // Auto-reload when new SW takes control
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (DEBUG) console.log("[SW] New version activated - reloading");
          window.location.reload();
        });

        // Track cache usage (optional monitoring)
        if (
          DEBUG &&
          "storage" in navigator &&
          "estimate" in navigator.storage
        ) {
          navigator.storage.estimate().then(({ usage, quota }) => {
            if (usage && quota) {
              console.log(
                `[Cache] Using ${(usage / 1024 / 1024).toFixed(2)} MB of ${(quota / 1024 / 1024).toFixed(2)} MB`
              );
            }
          });
        }
      } catch (error) {
        if (DEBUG) console.error("[SW] Registration failed:", error);
      }
    };

    // Wait for page load before registering
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
      return () => window.removeEventListener("load", registerSW);
    }
  }, []);

  return null;
}
