import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface RoleGuardProps {
  allowed: Array<'ADMIN' | 'USER'>;
  children: ReactNode;
}

export default function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) return null;

  if (!allowed.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}