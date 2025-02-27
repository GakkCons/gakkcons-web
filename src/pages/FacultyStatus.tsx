import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";

import {
  useGetTeachers,
  useRequestAppointment,
} from "../services/teacher/teacher.hooks";
import Header from "./components/header";
import Navbar from "./components/navbar";
import smileImg from "../assets/images/smile.png";
import { useSocket } from "./contexts/SocketContext";
import { useNotification } from "../services/notification/notification.hooks";

type Teacher = {
  user_id: string;
  name: string;
  subjects: string;
  faculty_mode?: string;
  appointments?: { mode: string; status: string }[];
};

type ValidationErrors = {
  selectedMode?: string;
  reason?: string;
};

function FacultyStatus() {
  const [isRequestTeacherOpen, setIsRequestTeacherOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedMode, setSelectedMode] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentValidationErrors, setAppointmentValidationErrors] =
    useState<ValidationErrors>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const io = useSocket();

  const { data: teacherData, refetch: refetchTeacherData } =
    useGetTeachers(searchQuery);

  const {
    mutate: requestMutate,
    isSuccess: isRequestSuccess,
    isPending: isRequestPending,
    isError: isRequestError,
    error: requestErrors,
  } = useRequestAppointment();

  const handleRequestTeacherOpen = (item: Teacher) => {
    if (!item.faculty_mode || item.faculty_mode === "offline") {
      const confirmProceed = window.confirm(
        "This instructor is not available. Do you want to proceed?"
      );
      if (!confirmProceed) return;
    }
    setSelectedTeacher(item);
    setIsRequestTeacherOpen(true);
  };

  useNotification();

  io.on("faculty_active_status", () => {
    refetchTeacherData();
  });

  const validateAndSubmit = () => {
    const validationErrors: ValidationErrors = {};
    if (!selectedMode) validationErrors.selectedMode = "Mode is required";
    if (!reason) validationErrors.reason = "Reason is required";

    if (Object.keys(validationErrors).length > 0) {
      setAppointmentValidationErrors(validationErrors);
      return;
    }
    setAppointmentValidationErrors({});
    requestMutate({
      facultyId: selectedTeacher ? selectedTeacher.user_id : "",
      reason: reason,
      mode: selectedMode,
    });
  };

  useEffect(() => {
    let toastId: string | null = null;

    if (isRequestPending) {
      if (!toastId) {
        toastId = toast.loading("Please wait. Loading...", {
          position: "top-center",
        });
      }
    } else {
      if (toastId) {
        toast.dismiss(toastId);
        toastId = null;
      }

      if (isRequestSuccess) {
        refetchTeacherData();
        setIsSuccess(true);
        setIsRequestTeacherOpen(false);
        setSelectedMode("");
        setAppointmentValidationErrors({});
        setReason("");
      }

      if (isRequestError) {
        toast.error(requestErrors?.message, {
          position: "top-center",
          duration: 4000,
        });
      }
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isRequestPending, isRequestSuccess, isRequestError, requestErrors]);

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
          <div className="flex flex-col justify-center w-full md:w-[60vw] lg:w-[70vw] h-auto gap-5">
            <div className="relative w-full lg:w-96">
              <input
                className="p-2 w-full lg:w-96 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                type="text"
                name="search"
                placeholder="Search Instructor"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <div className="absolute inset-y-0 right-8 flex items-center">
                <FontAwesomeIcon
                  className="text-xl text-black absolute"
                  icon={faMagnifyingGlass}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center overflow-x-auto w-full lg:w-[70vw] h-auto gap-3">
              {Array.isArray(teacherData?.[1]) &&
                teacherData[1].map((teacher, index) => (
                  <div
                    className="flex flex-row items-center justify-between py-4 px-5 bg-[#D9D9D9] hover:cursor-pointer"
                    key={index}
                    onClick={() => handleRequestTeacherOpen(teacher)}
                  >
                    <div className="flex flex-row items-center gap-4">
                      <FontAwesomeIcon size="2xl" icon={faUser} />
                      <p className="font-semibold text-lg">{teacher.name}</p>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                      <div className="flex flex-row gap-1">
                        <span
                          className={`px-2 py-1 h-7 text-sm font-medium rounded-l-md shadow-md ${
                            teacher.faculty_mode === "Onsite"
                              ? "bg-[#07181F] text-white"
                              : "bg-[#D7D7D7] text-black"
                          }`}
                        >
                          Onsite
                        </span>
                        <span
                          className={`px-2 py-1 h-7 text-sm font-medium rounded-r-md shadow-md ${
                            teacher.faculty_mode === "Online"
                              ? "bg-[#07181F] text-white"
                              : "bg-[#D7D7D7] text-black"
                          }`}
                        >
                          Online
                        </span>
                      </div>
                      <div className="flex flex-col items-center w-28">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            teacher.faculty_mode === "Onsite" ||
                            teacher.faculty_mode === "Online"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        />
                        <p className="text-sm font-medium">
                          {teacher.last_active
                            ? moment(teacher.last_active).fromNow()
                            : "Available"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={isRequestTeacherOpen}
        onClose={() => setIsRequestTeacherOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-end pb-12 justify-center lg:items-center lg:pb-0 bg-black/70 transition duration-300 ease-out data-[closed]:opacity-0 z-50"
      >
        <div className="relative bg-[#D1C8C3] p-6 rounded-lg w-96 shadow-lg">
          {selectedTeacher && (
            <div className="flex flex-row bg-white px-4 py-2 justify-between">
              <div className="flex items-center gap-4 border-b ">
                <FontAwesomeIcon size="2xl" icon={faUser} />
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedTeacher.name.length > 15
                      ? `${selectedTeacher.name.substring(0, 15)}...`
                      : selectedTeacher.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedTeacher.subjects}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-around rounded-md p-2">
                <div className="flex flex-row gap-1">
                  <button
                    className={`px-2 py-1 h-7 text-sm font-medium rounded-l-md shadow-md ${
                      selectedMode === "onsite"
                        ? "bg-[#07181F] text-white"
                        : "bg-[#D7D7D7] text-black"
                    }`}
                    onClick={() => setSelectedMode("onsite")}
                  >
                    Onsite
                  </button>
                  <button
                    className={`px-2 py-1 h-7 text-sm font-medium rounded-r-md shadow-md ${
                      selectedMode === "online"
                        ? "bg-[#07181F] text-white"
                        : "bg-[#D7D7D7] text-black"
                    }`}
                    onClick={() => setSelectedMode("online")}
                  >
                    Online
                  </button>
                </div>
                {appointmentValidationErrors.selectedMode && (
                  <p className="text-red-500 text-sm">
                    {appointmentValidationErrors.selectedMode}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="mt-0">
            <textarea
              className="mt-4 w-full p-2 border rounded-md h-36"
              placeholder="Reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
            {appointmentValidationErrors.reason && (
              <p className="text-red-500 text-sm">
                {appointmentValidationErrors.reason}
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-[#9BA0A1] text-white rounded-md"
              onClick={() => setIsRequestTeacherOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#15B31B] text-white rounded-md"
              onClick={validateAndSubmit}
            >
              Send request
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={isSuccess}
        onClose={() => setIsSuccess(false)}
        transition
        className="fixed inset-0 flex w-screen items-end pb-12 justify-center lg:items-center lg:pb-0 bg-black/70 transition duration-300 ease-out z-50"
      >
        <div className="bg-[#D1C8C3] p-6 rounded-lg w-96 shadow-lg">
          <div className="flex flex-col bg-white px-4 py-2">
            <div className="flex flex-col items-center gap-4 border-b">
              <img src={smileImg} />
              <div>
                <h3 className="text-lg font-semibold text-center">
                  Appointment successful! Please wait for a response from the
                  instructor.
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              className="px-4 py-2 bg-[#15B31B] text-white rounded-md w-[50%]"
              onClick={() => setIsSuccess(false)}
            >
              OK
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default FacultyStatus;
