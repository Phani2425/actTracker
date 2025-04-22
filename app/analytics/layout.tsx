import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { ReactNode } from "react";

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
