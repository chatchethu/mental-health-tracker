"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

export default function RouteLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800); // 0.8s gentle load
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && <LoadingOverlay />}
      {children}
    </>
  );
}
