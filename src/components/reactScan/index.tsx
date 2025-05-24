"use client";

import { useEffect } from "react";
import { scan } from "react-scan";
export const ReactScan = () => {
  useEffect(() => {
    scan({
      enabled: process.env.NODE_ENV === "development",
      log: true,
    });
  }, []);
  return null;
};
