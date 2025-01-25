import React, { useEffect, createContext, useContext, ReactNode } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { backendURL } from "../plugins/axios";

const fetchProfile = async () => {
  const token = sessionStorage.getItem("authToken");
  const response = await axios.get("/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const socket = io(backendURL as string);

const SocketContext = createContext<Socket | null>(socket);

interface SocketContextProviderProps {
  children: ReactNode;
}

const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });

  useEffect(() => {
    if (profile) {
      socket?.emit("register", profile.user_id);
    }
  }, [profile]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContextProvider;

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
