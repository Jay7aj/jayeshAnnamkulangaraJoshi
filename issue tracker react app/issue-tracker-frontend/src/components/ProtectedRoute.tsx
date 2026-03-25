// issue-tracker-frontend/src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps){
    const {user, loading} = useAuth();

    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}