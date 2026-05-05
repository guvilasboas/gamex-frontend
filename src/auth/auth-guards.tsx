import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { useAuthSession } from "./use-auth";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { token, session, isPending, isLoading } = useAuthSession();

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading || isPending) {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: PropsWithChildren) {
  const { token, session, isPending, isLoading } = useAuthSession();

  if (token && (isLoading || isPending)) {
    return <div>Loading session...</div>;
  }

  if (session) {
    return <Navigate to="/lobby" replace />;
  }

  return <>{children}</>;
}
