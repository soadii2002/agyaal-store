"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/components/ui/Spinner";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (adminOnly && !isAdmin) { router.replace("/"); }
  }, [user, loading, isAdmin, adminOnly]);

  if (loading || !user || (adminOnly && !isAdmin)) {
    return <Spinner center size="lg" />;
  }

  return children;
}
