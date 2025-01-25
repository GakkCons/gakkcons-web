import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../plugins/axios";
import { useSocket } from "../contexts/SocketContext";
import Error from "../components/error";

const useAuth = () => {
  const queryClient = useQueryClient();

  const authToken =
    queryClient.getQueryData(["authToken"]) ||
    sessionStorage.getItem("authToken");
  const userType =
    queryClient.getQueryData(["userType"]) ||
    sessionStorage.getItem("userType");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["authProfile"],
    queryFn: async () => {
      if (!authToken) {
        throw new Error("No token found");
      }

      const response = await axios.get("/users/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data;
    },
    enabled: !!authToken,
  });

  console.log("data", data);

  return {
    user: data,
    userType: data?.userType || userType,
    isAuthenticated: !!data,
    isActive: data?.is_active,
    isLoading,
    error,
    refetch,
  };
};

const ProtectedRoutes = ({ requiredRoles }: { requiredRoles?: string[] }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const io = useSocket();
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);
  const closeErrorModal = () => {
    setIsErrorOpen(false);
    setErrorMessage("");
    navigate("/");
  };
  const { userType, isAuthenticated, isActive, isLoading, refetch } = useAuth();

  io.on("user_status", () => {
    refetch();
  });

  useEffect(() => {
    if (isActive === false) {
      queryClient.removeQueries({ queryKey: ["authProfile"] });
      queryClient.removeQueries({ queryKey: ["authToken"] });
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userType");
      setErrorMessage(
        "Your account is deactivated. Please contact admin for support."
      );
      setIsErrorOpen(true);
    }
  }, [isActive, location.pathname, queryClient]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && isActive === true) {
    return <Navigate to="/" />;
  }

  if (requiredRoles && !requiredRoles.includes(userType)) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Outlet />
      <Error
        isOpen={isErrorOpen}
        onClose={closeErrorModal}
        message={errorMessage}
      />
    </>
  );
};

export default ProtectedRoutes;
