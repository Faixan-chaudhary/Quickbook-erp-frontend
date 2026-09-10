"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useQuery } from "@tanstack/react-query";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Authenticate session via HttpOnly cookie
  const { data: session, isLoading, isError } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        throw new Error("Unauthorized");
      }
      return res.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading && (isError || !session?.authenticated)) {
      router.replace("/");
    }
  }, [isLoading, isError, session, router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Show clean spinner while verifying session
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FBFA]">
        <div className="w-6 h-6 border-2 border-[#14968C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Prevent rendering private dashboard if unauthenticated
  if (isError || !session?.authenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
