import React, { useState, useEffect } from "react";
import LogoSmall from "../assets/images/logosmall.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faChevronDown,
  faFilter,
  faMagnifyingGlass,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./components/navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "./plugins/axios";
import "./style.css";
import Header from "./components/header";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ustp from '../assets/images/ustplogo.png'

// Fetch data function
const fetchAnalyticsData = async (token: string) => {
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get("appointments/get/analytics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch analytics data");
  }
};

const getTeachers = async (token: string) => {
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get("teachers/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch teachers data");
  }
};

function Report() {
  const [isExpanded, setIsExpanded] = useState(false);
  const token = sessionStorage.getItem("authToken");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); 
  const [filter, setFilter] = useState(""); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenStatus, setChosenStatus] = useState(""); // Renamed variable


  const handleStatusSelection = (status: string) => {
    setChosenStatus(status); // Update chosenStatus
    setIsModalOpen(false); // Close the modal after selection
    handleDownloadReport(status); // Pass the chosen status to the report function
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };


  const [isTeacherModal, setIsTeacherModal] = useState(false);
  const [chosenTeacher, setChosenTeacher] = useState("");

  const handleStatusSelection2 = (status: string) => {
    setChosenTeacher(status); // Update chosenStatus
    setIsTeacherModal(false); // Close the modal after selection
    handleDownloadTeacherReport(status); // Pass the chosen status to the report function
  };

  
  const handleTeacherOpenModal = () => {
    setIsTeacherModal(true); // Open the modal
  };

  const handleTeacherCloseModal = () => {
    setIsTeacherModal(false); // Close the modal
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => fetchAnalyticsData(token),
    enabled: !!token,
    retry: false,
  });

  console.log("data", data);
  // Fetch teachers data
  const {
    data: teachersData,
    error: teachersError,
    isLoading: teacherIsLoading,
  } = useQuery({
    queryKey: ["teachersdata"],
    queryFn: () => getTeachers(token!),
    enabled: !!token,
    retry: false,
  });

  console.log("teacher", teachersData);
  const [filteredRequests, setFilteredRequests] = useState([]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase()); // Make search case-insensitive
  };

  // Filter teachers based on search query
  const filteredTeachers = teachersData
    ? teachersData.filter((teacher: any) =>
        teacher.name.toLowerCase().includes(searchQuery)
      )
    : [];

  useEffect(() => {
    if (teachersData) {
      setFilteredRequests(filteredTeachers);
    }
  }, [teachersData, searchQuery]); // Depend on both teachersData and searchQuery

  // Handle time formatting
  const formatTime = (time) => {
    if (time) {
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'
      return `${hour}:${minutes} ${ampm}`;
    }
  };

  if (isLoading || teacherIsLoading) return <div>Loading...</div>;
  if (error || teachersError)
    return <div>Error: {error?.message || teachersError?.message}</div>;


  const handleDownloadReport = (status: string) => {
    const appointments = data?.appointments || [];
  
    const filteredAppointments = appointments.filter((appointment) => {
      return appointment.appointment_status === status || status === "All";
    });
  
    const rows = filteredAppointments.map((appointment) => [
      `${appointment.student_firstname} ${appointment.student_lastname}`,
      `${appointment.instructor_first_name} ${appointment.instructor_last_name}`,
      appointment.appointment_date,
      formatTime(appointment.appointment_time),
      appointment.consultation_mode,
    ]);
  
    const headers = [
      ["Student", "Teacher", "Date", "Time", "Request Mode"],
    ];
  
    const doc = new jsPDF();
  
    let pageWidth = doc.internal.pageSize.width;
    let pageHeight = doc.internal.pageSize.height;
  
    const img = new Image();
    img.src = ustp;
    img.onload = () => {
      let aspectRatio = img.width / img.height;
      let imgWidth = pageWidth; 
      let imgHeight = imgWidth / aspectRatio; 
  
      if (imgHeight > pageHeight) {
        let scaleFactor = pageHeight / imgHeight;
        imgHeight = pageHeight;
        imgWidth *= scaleFactor;
      }
  
      doc.addImage(ustp, "PNG", 0, 10, imgWidth, imgHeight); 
  
      doc.setFontSize(18);
      doc.text("Consultation Appointment Report", pageWidth / 2, 10 + imgHeight + 10, { align: 'center' });
  
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(12);
      doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 10 + imgHeight + 20, { align: 'center' });

        
      // Add a subtitle (optional)
      doc.setFontSize(12);
      doc.text(`Status: ${status}`, pageWidth / 2, 10 + imgHeight + 30, { align: "center" });


      doc.autoTable({
        head: headers,
        body: rows,
        startY: 10 + imgHeight + 35, 
        styles: {
          halign: "center",
        },
        headStyles: {
          fillColor: [41, 128, 185], 
          textColor: [255, 255, 255], 
          fontSize: 12,
        },
        bodyStyles: {
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });
  
      // Save the PDF
      const filename = `consultation_report_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(filename);
    };
  };
  


  // const handleDownloadTeacherReport = (status: string) => {
  //   const filteredAppointments = filteredAppointments1.filter((appointment) => {
  //     return status === "All" || appointment.status === status;
  //   });
  
  //   if (filteredAppointments.length > 0) {
  //     const headers = [
  //       "TEACHER",
  //       "STUDENT",
  //       "DATE",
  //       "TIME",
  //       "REQUEST MODE",
  //     ];
  
  //     const teacherName = filteredTeachers.length > 0
  //       ? filteredTeachers[0].name
  //       : "Unknown Teacher";
  
  //       let rows = filteredAppointments.map((request) => [
  //       teacherName,
  //       `${request.student.first_name} ${request.student.last_name}`,
  //       new Date(request.scheduled_date).toISOString().split("T")[0],
  //       new Date(request.scheduled_date).toLocaleTimeString("en-US", {
  //         hour: "numeric",
  //         minute: "2-digit",
  //         hour12: true,
  //         timeZone: "Asia/Manila",
  //       }),
  //       request.mode,
  //     ]);
  
  //     // Create a new jsPDF instance
  //     let doc = new jsPDF();
  
  //     let pageWidth = doc.internal.pageSize.width;
  //     let pageHeight = doc.internal.pageSize.height;  
  
  //     let img = new Image();
  //     img.src = ustp; // assuming 'ustp' is the image source URL or data URI
  
  //     img.onload = () => {
  //       let aspectRatio = img.width / img.height;
  //       let imgWidth = pageWidth; 
  //       let imgHeight = imgWidth / aspectRatio;
  
  //       if (imgHeight > pageHeight) {
  //         let scaleFactor = pageHeight / imgHeight;
  //         imgHeight = pageHeight;
  //         imgWidth *= scaleFactor;
  //       }
  
  //       doc.addImage(img, "PNG", 0, 10, imgWidth, imgHeight); // Add the image
  
  //       // Add a title to the PDF
  //       doc.setFontSize(18);
  //       doc.text("Teacher Consultation Report", pageWidth / 2, 10 + imgHeight + 10, { align: "center" });

  //       const currentDate = new Date().toLocaleDateString();
  //       doc.setFontSize(12);
  //       doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 10 + imgHeight + 20, { align: 'center' });

          
  //       // Add a subtitle (optional)
  //       doc.setFontSize(12);
  //       doc.text(`Status: ${status}`, pageWidth / 2, 10 + imgHeight + 30, { align: "center" });
  

  //       // Add the table using jsPDF AutoTable
  //       doc.autoTable({
  //         head: [headers],
  //         body: rows,
  //         startY: 10 + imgHeight + 35, // Start the table below the title and image
  //         styles: {
  //           fontSize: 10,
  //           halign: "center", // Center align text
  //         },
  //         headStyles: {
  //           fillColor: [41, 128, 185], // Blue header
  //           textColor: [255, 255, 255], // White text
  //           fontSize: 12,
  //         },
  //         bodyStyles: {
  //           fontSize: 10,
  //         },
  //         alternateRowStyles: {
  //           fillColor: [240, 240, 240],
  //         },
  //       });
  
  //       // Save the generated PDF
  //       doc.save("teacher_report.pdf");
  //     };
  //   }
  // };
  

  const handleDownloadTeacherReport = (status: string) => {
    const filteredAppointments = filteredAppointments1.filter((appointment) => {
      return status === "All" || appointment.status === status;
    });

  
    if (filteredAppointments.length > 0) {
      const headers = [
        "ID NUMBER",
        "STUDENT",
        "DATE",
        "TIME",
        "REQUEST MODE",
      ];
  
      const teacherName = filteredTeachers.length > 0
        ? filteredTeachers[0].name
        : "Unknown Teacher";
  
      let rows = filteredAppointments.map((request) => [
        request.student.student_id,
        `${request.student.first_name} ${request.student.last_name}`,
        new Date(request.scheduled_date).toISOString().split("T")[0],
        new Date(request.scheduled_date).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Manila",
        }),
        request.mode,
      ]);
  
      let doc = new jsPDF();
  
      let pageWidth = doc.internal.pageSize.width;
      let pageHeight = doc.internal.pageSize.height;
  
      let img = new Image();
      img.src = ustp; // assuming 'ustp' is the image source URL or data URI
  
      img.onload = () => {
        let aspectRatio = img.width / img.height;
        let imgWidth = pageWidth;
        let imgHeight = imgWidth / aspectRatio;
  
        if (imgHeight > pageHeight) {
          let scaleFactor = pageHeight / imgHeight;
          imgHeight = pageHeight;
          imgWidth *= scaleFactor;
        }
  
        doc.addImage(img, "PNG", 0, 10, imgWidth, imgHeight);
  
        // Title
        doc.setFontSize(18);
        doc.text("Teacher Consultation Report", pageWidth / 2, imgHeight + 20, { align: "center" });

        // Date Generated
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Generated on: ${currentDate}`, pageWidth / 2, imgHeight + 30, { align: "center" });
  
        // Status
        doc.setFontSize(12);
        doc.text(`Status: ${status}`, pageWidth / 2, imgHeight + 40, { align: "center" });
  
        doc.text(`Teacher: ${teacherName}`, 15, imgHeight + 50);

        // Table
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: imgHeight + 60,
          styles: {
            fontSize: 10,
            halign: "center",
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontSize: 12,
          },
          bodyStyles: {
            fontSize: 10,
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
        });
  
        doc.save("teacher_report.pdf");
      };
    }
  };
  

  const handleFilterChange = (status) => {
    setFilter(status); // Set the filter when a user clicks on a specific category
  };

  // Filter appointments based on the selected status
  const filteredAppointments = data.appointments.filter((request) =>
    filter ? request.appointment_status === filter : true
  );

  const handleStatusClick = (status) => {
    setSelectedStatus(status); // Update status filter when a user clicks on a status
  };

  const filteredAppointments1 =
    filteredTeachers.length > 0
      ? filteredTeachers[0].appointments.filter((appointment) =>
          selectedStatus ? appointment.status === selectedStatus : true
        )
      : [];

  return (
    <>
      <Header />

      {/* Report Content */}
      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4">
        {/* Handle Loading and Error States */}
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
          <div
            className="col-span-1 md:col-span-4 lg:col-span-3 detail-status"
            style={{ position: "relative" }}
          >
            <Navbar />
          </div>

          <div
            className="col-span-1 md:col-span-8 lg:col-span-9"
            style={{
              maxWidth: "100%",
              width: "100%",
              maxHeight: "100%",
              height: "auto",
              background: "white",
              borderRadius: "7px",
            }}
          >
            <div className="pb-2 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex justify-start items-center gap-2">
                <h1 className="text-black text-xl sm:text-2xl tracking-wide font-semibold">
                  Consultation Report Dashboard
                </h1>
                <FontAwesomeIcon
                  className="text-xl sm:text-2xl text-black"
                  icon={faChartSimple}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    className="p-2 w-96 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    type="text"
                    name="search"
                    placeholder="Search Instructor"
                    value={searchQuery}
                    onChange={handleSearchChange} // Handle search input
                  />
                  <FontAwesomeIcon
                    className="text-xl text-black absolute right-3 top-2.5"
                    icon={faMagnifyingGlass}
                  />
                </div>

              </div>
            </div>

            {/* Render teacher search results */}
            {searchQuery ? (
              <div
                className="p-2 md:p-10 mb-2"
                style={{ background: "#282726", borderRadius: "7px" }}
              >
                <div className="flex justify-between items-center mb-2">
                  {/* Display teacher name from filteredTeachers */}
                  <h1 className="text-white text-2xl tracking-wide font-semibold">
                    {filteredTeachers.length > 0
                      ? filteredTeachers[0].name
                          .toLowerCase()
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : "No Instructor Found"}
                  </h1>
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 my-5 p-5"
                  style={{ borderRadius: 10, background: "#D1C8C3" }}
                >
                  {filteredTeachers.length > 0 && (
                    <>
                      <div
                        className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-6"
                        onClick={() => handleStatusClick("")}
                      >
                        <p className="text-4xl text-right mb-5 font-bold text-gray-900 mt-2">
                          {filteredTeachers[0].appointments.length}
                        </p>
                        <h2 className="text-xl font-semibold text-gray-700">
                          Appointments
                        </h2>
                      </div>

                      <div
                        className="bg-green-100 shadow-md rounded-lg md:ml-2 p-6"
                        onClick={() => handleStatusClick("Confirmed")}
                      >
                        <p className="text-4xl text-right mb-5 font-bold text-green-900 mt-2">
                          {
                            filteredTeachers[0].appointments.filter(
                              (appointment) =>
                                appointment.status === "Confirmed"
                            ).length
                          }
                        </p>
                        <h2 className="text-xl font-semibold text-green-700">
                          Approved
                        </h2>
                      </div>

                      <div
                        className="bg-red-100 shadow-md rounded-lg p-6"
                        onClick={() => handleStatusClick("Denied")}
                      >
                        <p className="text-4xl text-right mb-5 font-bold text-red-900 mt-2">
                          {
                            filteredTeachers[0].appointments.filter(
                              (appointment) => appointment.status === "Denied"
                            ).length
                          }
                        </p>
                        <h2 className="text-xl font-semibold text-red-700">
                          Rejected
                        </h2>
                      </div>

                      <div
                        className="bg-blue-100 shadow-md rounded-lg p-6"
                        onClick={() => handleStatusClick("Pending")}
                      >
                        <p className="text-4xl text-right mb-5 font-bold text-blue-900 mt-2">
                          {
                            filteredTeachers[0].appointments.filter(
                              (appointment) => appointment.status === "Pending"
                            ).length
                          }
                        </p>
                        <h2 className="text-xl font-semibold text-blue-700">
                          Pending
                        </h2>
                      </div>

                      <div
                        className="bg-yellow-100 shadow-md rounded-lg p-6"
                        onClick={() => handleStatusClick("Completed")}
                      >
                        <p className="text-4xl text-right mb-5 font-bold text-yellow-900 mt-2">
                          {
                            filteredTeachers[0].appointments.filter(
                              (appointment) =>
                                appointment.status === "Completed"
                            ).length
                          }
                        </p>
                        <h2 className="text-xl font-semibold text-yellow-700">
                          Completed
                        </h2>
                      </div>
                    </>
                  )}
                </div>

                {/* Consultation Log */}
                <div
                  className=" mb-5 min-h-[700px] rounded-md px-5"
                  style={{ borderRadius: 10, background: "#D1C8C3" }}
                >
                  <div className="flex justify-between items-center py-2">
                    <h1 className="text-black font-bold text-2xl p-2">
                      Consultation Appoinment Log
                    </h1>
                    <button
                      className="text-lg text-dark"
                      onClick={handleTeacherOpenModal}
                    >
                      Download Report
                      <span className="mr-2"></span>
                      <FontAwesomeIcon icon={faPrint} />
                    </button>
                  </div>
                  {isTeacherModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-lg p-8 w-full sm:w-96 md:w-1/2 shadow-xl">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Choose a Status</h2>

                        <div className="space-y-4">
                            <button
                              className="w-full py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              onClick={() => handleStatusSelection2("All")}
                            >
                              All
                            </button>

                          {/* Approved Button */}
                          {filteredAppointments1.filter((item) => item.status === "Confirmed").length > 0 && (
                            <button
                              className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                              onClick={() => handleStatusSelection2("Confirmed")}
                            >
                              Approved
                            </button>
                          )}

                          {/* Rejected Button */}
                          {filteredAppointments1.filter((item) => item.status === "Denied").length > 0 && (
                            <button
                              className="w-full py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                              onClick={() => handleStatusSelection2("Denied")}
                            >
                              Rejected
                            </button>
                          )}

                          {/* Pending Button */}
                          {filteredAppointments1.filter((item) => item.status === "Pending").length > 0 && (
                            <button
                              className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                              onClick={() => handleStatusSelection2("Pending")}
                            >
                              Pending
                            </button>
                          )}

                          {/* Completed Button */}
                          {filteredAppointments1.filter((item) => item.status === "Completed").length > 0 && (
                            <button
                              className="w-full py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              onClick={() => handleStatusSelection2("Completed")}
                            >
                              Completed
                            </button>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <button
                            className="mt-6 w-40 py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            onClick={() => setIsTeacherModal(false)} // Close the modal
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


                  <div
                    className="w-full min-h-[600px] rounded-md pt-5"
                    style={{ background: "white" }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-center table-auto">
                        <thead>
                          <tr>
                            <th className="py-2 px-4">STUDENT</th>
                            <th className="py-2 px-4">DATE</th>
                            <th className="py-2 px-4">TIME</th>
                            <th className="py-2 px-4">REQUEST MODE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments1.length > 0 ? (
                            filteredAppointments1.map((request) => (
                              <tr key={request.appointment_id}>
                                <td className="py-2 px-4 capitalize">
                                  {request.student.first_name}{" "}
                                  {request.student.last_name}
                                </td>
                                <td className="py-2 px-4">
                                  {
                                    new Date(request.scheduled_date)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </td>
                                <td className="py-2 px-4">
                                  {new Date(
                                    request.scheduled_date
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "Asia/Manila",
                                  })}
                                </td>
                                <td className="py-2 px-4">{request.mode}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4}>No appointments found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              //         // overall
              <div
                className="p-2 md:p-10 mb-2"
                style={{ background: "#282726", borderRadius: "7px" }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-white text-2xl tracking-wide font-semibold">
                    Overall Instructor
                  </h1>
                </div>
                <div
                  className="p-4 md:p-1"
                  style={{ borderRadius: 10, background: "#D1C8C3" }}
                >
                  {/* Appointment Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 my-5 p-5">
                    <div
                      className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-6"
                      onClick={() => handleFilterChange("")}
                    >
                      <p className="text-4xl text-right mb-5 font-bold text-gray-900 mt-2">
                        {data.total_appointments}
                      </p>
                      <h2 className="text-xl font-semibold text-gray-700">
                        Appointments
                      </h2>
                    </div>

                    <div
                      className="bg-green-100 shadow-md rounded-lg md:ml-2 p-6"
                      onClick={() => handleFilterChange("Confirmed")}
                    >
                      <p className="text-4xl text-right mb-5 font-bold text-green-900 mt-2">
                        {data.approved_appointments}
                      </p>
                      <h2 className="text-xl font-semibold text-green-700">
                        Approved
                      </h2>
                    </div>

                    <div
                      className="bg-red-100 shadow-md rounded-lg p-6"
                      onClick={() => handleFilterChange("Denied")}
                    >
                      <p className="text-4xl text-right mb-5 font-bold text-red-900 mt-2">
                        {data.rejected_appointments}
                      </p>
                      <h2 className="text-xl font-semibold text-red-700">
                        Rejected
                      </h2>
                    </div>

                    <div
                      className="bg-blue-100 shadow-md rounded-lg p-6"
                      onClick={() => handleFilterChange("Pending")}
                    >
                      <p className="text-4xl text-right mb-5 font-bold text-blue-900 mt-2">
                        {data.pending_appointments}
                      </p>
                      <h2 className="text-xl font-semibold text-blue-700">
                        Pending
                      </h2>
                    </div>

                    <div
                      className="bg-yellow-100 shadow-md rounded-lg p-6"
                      onClick={() => handleFilterChange("Completed")}
                    >
                      <p className="text-4xl text-right mb-5 font-bold text-yellow-900 mt-2">
                        {data.completed_appointments}
                      </p>
                      <h2 className="text-xl font-semibold text-yellow-700">
                        Completed
                      </h2>
                    </div>
                  </div>

                  <div
                    className="mx-5 mb-5 min-h-[700px] rounded-md px-5"
                    style={{ background: "rgba(40, 39, 38, 1)" }}
                  >
                    <div className="flex justify-between items-center py-2 mr-3">
                      <h1 className="text-white font-bold text-2xl p-2">
                        Consultation Appointment Log
                      </h1>

                      <div className="datepicker ">
                        
                      </div>
                      
                      <button
                        className="text-lg text-white"
                        onClick={handleOpenModal} // Trigger the download when clicked
                      >
                        Download Report
                        <span className="mr-2"></span>
                        <FontAwesomeIcon icon={faPrint} />
                      </button>
                    </div>
                    {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg p-8 w-full sm:w-96 md:w-1/2 shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Choose a Status</h2>

      <div className="space-y-4">
          <button
            className="w-full py-3 px-6 bg-white-500 text-black border-2 border-black rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => handleStatusSelection("All")}
          >
            All
          </button>
        

        {/* Approved Button */}
        {filteredAppointments.filter((item) => item.appointment_status === "Confirmed").length > 0 && (
          <button
            className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => handleStatusSelection("Confirmed")}
          >
            Approved
          </button>
        )}

        {/* Rejected Button */}
        {filteredAppointments.filter((item) => item.appointment_status === "Denied").length > 0 && (
          <button
            className="w-full py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => handleStatusSelection("Denied")}
          >
            Rejected
          </button>
        )}

        {/* Pending Button */}
        {filteredAppointments.filter((item) => item.appointment_status === "Pending").length > 0 && (
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => handleStatusSelection("Pending")}
          >
            Pending
          </button>
        )}

        {/* Completed Button */}
        {filteredAppointments.filter((item) => item.appointment_status === "Completed").length > 0 && (
          <button
            className="w-full py-3 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => handleStatusSelection("Completed")}
          >
            Completed
          </button>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="mt-6 w-40 py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          onClick={handleCloseModal}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

                    <div
                      className="w-full min-h-[600px] rounded-md pt-5"
                      style={{ background: "white" }}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-center table-auto">
                          <thead>
                            <tr>
                              <th className="py-2 px-4">STUDENT</th>
                              <th className="py-2 px-4">TEACHER</th>
                              <th className="py-2 px-4">DATE</th>
                              <th className="py-2 px-4">TIME</th>
                              <th className="py-2 px-4">REQUEST MODE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAppointments.length > 0 ? (
                              filteredAppointments.map((request) => (
                                <tr key={request.appointment_id}>
                                  <td className="py-2 px-4 capitalize">
                                    {request.student_firstname}{" "}
                                    {request.student_lastname}
                                  </td>
                                  <td className="py-2 px-4 capitalize">
                                    {request.instructor_first_name}{" "}
                                    {request.instructor_last_name}
                                  </td>
                                  <td className="py-2 px-4">
                                    {request.appointment_date}
                                  </td>
                                  <td className="py-2 px-4">
                                    {formatTime(request.appointment_time)}
                                  </td>
                                  <td className="py-2 px-4 uppercase">
                                    {request.consultation_mode}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="4"
                                  className="text-center text-gray-500"
                                >
                                  No Requests Available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
