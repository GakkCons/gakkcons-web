import React, { useState } from "react";
import { Link, useLocation } from "react-router"; // Updated import for 'react-router-dom'
import addmessageicon from "../../assets/images/addmessage.png";
import checklist from "../../assets/images/listchecklist.png";
import profilelogo from "../../assets/images/profilelogo.png";
import report from "../../assets/images/barchar.png";
import useraccount from "../../assets/images/qwe.png";
import notificationIcon from "../../assets/images/notification.png";
import axios from "../plugins/axios";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFolderBlank,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

// Function to fetch appointments
const fetchAppointments = async (token: string) => {
  const response = await axios.get("/appointments", {
    headers: {
      Authorization: `Bearer ${token}`, // Use the actual token here
    },
  });
  return response.data;
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Track the current path
  const userType = sessionStorage.getItem("userType"); // Get userType from sessionStorage (or query client if you're using TanStack query)

  const token = sessionStorage.getItem("authToken");

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetchAppointments(token),
    retry: false,
    enabled: !!token,
  });

  console.log("navbar", data);

  const pendingAppointmentsCount =
    data?.filter((appointment: any) => appointment.status === "Pending")
      .length || 0;
  const confirmedAppoinmentsCount =
    data?.filter((appointment: any) => appointment.status === "Confirmed")
      .length || 0;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  console.log(userType);
  return (
    <nav className="m-0" style={{ width: "100%" }}>
      <div className="flex flex-col">
        <div className="flex-grow">
          <ul className="flex flex-col space-y-1 mt-4">
            {userType === "faculty" && (
              <>
                <li>
                  <Link
                    to="/home"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/home"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex justify-between items-center gap-3 p-3 ">
                      <div className="flex content-between">
                        <img
                          src={addmessageicon}
                          style={{ width: "30px", height: "30px" }}
                          className="ml-1 mr-2"
                          alt=""
                        />
                        <h1 className="text-lg font-bold">
                          Consultation Request
                        </h1>
                      </div>

                      <div className="bg-red-300 px-2 py-1 rounded-full">
                        <h1 className="text-lg font-bold">
                          {pendingAppointmentsCount}
                        </h1>
                      </div>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/consultationqueue"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/consultationqueue"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex justify-between items-center p-3">
                      <div className="flex content-between">
                        <img
                          src={checklist}
                          style={{ width: "30px", height: "30px" }}
                          className="ml-1 mr-2"
                          alt=""
                        />
                        <h1 className="text-lg font-bold">
                          Consultation Queue
                        </h1>
                      </div>

                      <div className="bg-red-300 px-2 py-1 rounded-full">
                        <h1 className="text-lg font-bold">
                          {confirmedAppoinmentsCount}
                        </h1>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/record"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/record"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex content-between items-center p-3">
                      <FontAwesomeIcon
                        className="ml-1 mr-2"
                        icon={faFolderBlank}
                        style={{ fontSize: "30px" }}
                      />

                      <h1 className="text-lg font-bold">Consultation Record</h1>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/profile"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex content-between items-center p-3">
                      <img
                        src={profilelogo}
                        style={{ width: "30px", height: "30px" }}
                        className="ml-1 mr-2"
                        alt=""
                      />
                      <h1 className="text-lg font-bold">Profile</h1>
                    </div>
                  </Link>
                </li>
              </>
            )}

            {userType === "admin" && (
              <>
                <li style={{ marginTop: "0px" }}>
                  <Link
                    to="/accounts"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/accounts"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex content-between items-center p-3">
                      <img
                        src={useraccount}
                        style={{ width: "30px", height: "30px" }}
                        className="ml-1 mr-2"
                        alt=""
                      />
                      <h1 className="text-lg font-bold">User Accounts</h1>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/report"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/report"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex content-between items-center p-3">
                      <img
                        src={report}
                        style={{ width: "30px", height: "30px" }}
                        className="ml-1 mr-2"
                        alt=""
                      />
                      <h1 className="text-lg font-bold">Report Status</h1>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/profile"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/profile"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex content-between items-center p-3">
                      <img
                        src={profilelogo}
                        style={{ width: "30px", height: "30px" }}
                        className="ml-1 mr-2"
                        alt=""
                      />
                      <h1 className="text-lg font-bold">Profile</h1>
                    </div>
                  </Link>
                </li>
              </>
            )}

            {userType === "student" && (
              <>
                <li>
                  <Link
                    to="/faculty-status"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/faculty-status"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex justify-between items-center gap-3 p-3 ">
                      <div className="flex content-between">
                        <img
                          src={addmessageicon}
                          style={{ width: "30px", height: "30px" }}
                          className="ml-1 mr-2"
                          alt=""
                        />
                        <h1 className="text-lg font-bold">Faculty Status</h1>
                      </div>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/notification"
                    className={`block shadow text-black hover:bg-blue-700 ${
                      location.pathname === "/notification"
                        ? "border-l-8 border-black bg-blue-100"
                        : ""
                    }`}
                    style={{ borderRadius: "7px" }}
                  >
                    <div className="flex justify-between items-center gap-3 p-3 ">
                      <div className="flex content-between">
                        <img
                          src={notificationIcon}
                          style={{ width: "30px", height: "30px" }}
                          className="ml-1 mr-2"
                          alt=""
                        />
                        <h1 className="text-lg font-bold">Notification</h1>
                      </div>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
