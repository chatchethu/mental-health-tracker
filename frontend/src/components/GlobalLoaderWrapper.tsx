"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function GlobalLoaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // ✅ Show loader on initial load + page transitions
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // duration
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className={loading ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
    </>
  );
}
