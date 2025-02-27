import { useEffect } from "react";

import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "./notification.requests";
import { useSocket } from "../../pages/contexts/SocketContext";

export function useNotification() {
  const io = useSocket();

  useEffect(() => {
    const handleNotification = (message: { text: string }) => {
      toast.success(
        (t) => (
          <div className="flex items-center justify-between gap-2">
            <span>{message.text}</span>
            <button
              className="px-2 py-1 text-white bg-red-500 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Dismiss
            </button>
          </div>
        ),
        {
          position: "top-center",
          duration: Infinity,
        }
      );
    };

    io.on("notification", handleNotification);
    return () => {
      io.off("notification", handleNotification);
    };
  }, [io]);
}

export function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const result = await getNotifications();
      if (result[0] !== true) {
        return Promise.reject(new Error(result[1]));
      }
      return result;
    },
    enabled: false,
  });
}
