import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
