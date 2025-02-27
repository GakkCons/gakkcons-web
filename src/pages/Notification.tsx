import { useEffect, useState, useMemo } from "react";
import moment from "moment";
import {
  useGetNotifications,
  useNotification,
} from "../services/notification/notification.hooks";
import { useSocket } from "./contexts/SocketContext";
import { Dialog } from "@headlessui/react";
import Header from "./components/header";
import Navbar from "./components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faUser } from "@fortawesome/free-regular-svg-icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface Notification {
  appointment_id: string;
  faculty_name: string;
  mode: string;
  scheduled_date: string;
  status: string;
  updated_at: string;
  meet_link?: string;
  subject: string;
}

export default function Notification() {
  const io = useSocket();
  const [isNotifPressed, setIsNotifPressed] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const { data: notificationData, refetch } = useGetNotifications();

  useNotification();

  useEffect(() => {
    refetch();
    io.on("notification", refetch);
    return () => {
      io.off("notification", refetch);
    };
  }, []);

  const notifications = useMemo(() => {
    if (!notificationData || !Array.isArray(notificationData)) return [];
    return Array.isArray(notificationData[1]) ? notificationData[1] : [];
  }, [notificationData]);

  const formatGroupLabel = (date: string) => {
    const now = moment();
    const notificationDate = moment(date);

    if (notificationDate.isSame(now, "day")) return "Today";
    if (notificationDate.isSame(moment().subtract(1, "day"), "day"))
      return "Yesterday";
    if (now.diff(notificationDate, "days") < 4)
      return `${now.diff(notificationDate, "days")} days ago`;
    return notificationDate.format("MMM DD, YYYY");
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    return notifications.reduce(
      (groups: Record<string, Notification[]>, notif) => {
        const label = formatGroupLabel(notif.updated_at);
        if (!groups[label]) groups[label] = [];
        groups[label].push(notif);
        return groups;
      },
      {}
    );
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  const handleNotification = (notif: Notification) => {
    setSelectedNotification(notif);
    setIsNotifPressed(true);
  };

  return (
    <div>
      <Header />
      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
          <div
            className="col-span-1 md:col-span-4 lg:col-span-3 detail-status"
            style={{ position: "relative" }}
          >
            <Navbar />
          </div>
          <div className="flex flex-col gap-5 p-5 w-full md:w-[60vw] lg:w-[70vw] h-auto">
            <div className="overflow-y-auto max-h-[80vh]">
              {notifications.length === 0 && (
                <p>No notification at the moment.</p>
              )}
              {Object.entries(groupedNotifications).map(([date, notifs]) => (
                <div key={date}>
                  <h2 className="text-lg font-bold pl-5">{date}</h2>
                  {notifs.map((notif) => (
                    <div
                      key={notif.appointment_id}
                      className="p-4 flex items-start gap-4 border-b cursor-pointer hover:bg-gray-100"
                      onClick={() => handleNotification(notif)}
                    >
                      <div className="bg-gray-700 w-14 h-14 flex items-center justify-center rounded-full">
                        <FontAwesomeIcon
                          size="2xl"
                          icon={faUser}
                          color="white"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{notif.faculty_name}</p>
                        <p className="text-sm text-gray-600">
                          {notif.status === "Confirmed" &&
                            `${
                              notif.faculty_name
                            } has accepted your consultation request. Venue: ${
                              notif.mode
                            }. Date: ${moment(notif.scheduled_date).format(
                              "MMM DD, YYYY [at] hh:mm A"
                            )}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Dialog
              open={isNotifPressed}
              onClose={() => setIsNotifPressed(false)}
              transition
              className="fixed inset-0 flex w-screen items-end pb-12 justify-center lg:items-center lg:pb-0 bg-black/70 transition duration-300 ease-out data-[closed]:opacity-0 z-50"
            >
              {selectedNotification && (
                <div className="flex flex-col bg-white p-5 rounded-lg w-[80vw] md:[50vw] lg:w-[25vw] mx-auto">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-700 w-14 h-14 flex items-center justify-center rounded-full">
                      <FontAwesomeIcon size="2xl" icon={faUser} color="white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">
                        {selectedNotification.faculty_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedNotification.subject}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 mt-4 rounded-lg">
                    <p className="text-sm">
                      {selectedNotification.status === "Confirmed" &&
                        `${selectedNotification.faculty_name} has accepted your consultation request. Venue: ${selectedNotification.mode}`}
                    </p>
                  </div>
                  {selectedNotification.meet_link && (
                    <div className="flex items-center gap-2 mt-4">
                      <p className="text-sm">Link:</p>
                      <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-between w-full">
                        <p className="truncate w-3/4">
                          {selectedNotification.meet_link}
                        </p>
                        <CopyToClipboard text={selectedNotification.meet_link}>
                          <button>
                            <FontAwesomeIcon size="sm" icon={faClipboard} />
                          </button>
                        </CopyToClipboard>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setIsNotifPressed(false)}
                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg self-center"
                  >
                    Close
                  </button>
                </div>
              )}
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
