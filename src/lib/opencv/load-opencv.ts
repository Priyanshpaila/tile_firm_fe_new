"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    cv?: any;
  }
}

let openCvPromise: Promise<any> | null = null;

export function loadOpenCv(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("OpenCV can only load in the browser."));
  }

  if (openCvPromise) return openCvPromise;

  openCvPromise = new Promise((resolve, reject) => {
    const finishIfReady = async () => {
      try {
        const maybeCv = window.cv;
        if (!maybeCv) return false;

        const cvResolved =
          typeof maybeCv.then === "function" ? await maybeCv : maybeCv;

        if (cvResolved?.Mat && cvResolved?.warpPerspective) {
          resolve(cvResolved);
          return true;
        }

        return false;
      } catch (error) {
        reject(error);
        return true;
      }
    };

    finishIfReady().then((ready) => {
      if (ready) return;

      const existing = document.querySelector(
        'script[data-opencv-script="true"]',
      ) as HTMLScriptElement | null;

      const script =
        existing ||
        Object.assign(document.createElement("script"), {
          src: "/opencv/opencv.js",
          async: true,
        });

      script.dataset.opencvScript = "true";

      const poll = () => {
        finishIfReady().then((done) => {
          if (!done) {
            window.setTimeout(poll, 50);
          }
        });
      };

      script.onload = () => {
        poll();
      };

      script.onerror = () => {
        reject(
          new Error(
            "Failed to load /opencv/opencv.js. Put the official prebuilt file into public/opencv/opencv.js",
          ),
        );
      };

      if (!existing) {
        document.body.appendChild(script);
      } else {
        poll();
      }
    });
  });

  return openCvPromise;
}

export function useOpenCv() {
  const [cv, setCv] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadOpenCv()
      .then((resolved) => {
        if (!cancelled) setCv(resolved);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load OpenCV.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { cv, error };
}