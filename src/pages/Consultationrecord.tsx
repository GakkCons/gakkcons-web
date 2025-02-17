import React, { useState } from 'react'
import Header from './components/header'
import Navbar from './components/navbar';
import calendarIcon from "../assets/images/CRD.png";
import { useQuery } from "@tanstack/react-query";
import axios from "../pages/plugins/axios";

// Function to fetch appointments
const fetchAppointments = async (token: string) => {
    const response = await axios.get("/appointments", {
      headers: {
        Authorization: `Bearer ${token}`, // Use the actual token here
      },
    });
    return response.data;
};
  

function Consultationrecord() {


    const [selectedStatus, setSelectedStatus] = useState("");

    const token = sessionStorage.getItem("authToken");

    const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetchAppointments(token),
    retry: false,
    enabled: !!token,
    });

    console.log('Data record: ', data)


    const formatTime = (time) => {
        if (time) {
          const [hours, minutes] = time.split(":");
          let hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? "PM" : "AM";
          hour = hour % 12;
          hour = hour ? hour : 12; // the hour '0' should be '12'
          const formattedTime = `${hour}:${minutes} ${ampm}`;
          return formattedTime;
        }
      };
    

      const filteredRequests =
      data?.filter((request) =>
        selectedStatus ? request.status === selectedStatus : true
      ) || [];
  
    
  return (
    <div>
        <Header />
          <div className="mx-2 sm:mx-4 md:mx-10 details mt-4 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
            <div className="col-span-1 md:col-span-4 lg:col-span-3 detail-status" style={{ position: 'relative' }}>
                <Navbar />
            </div>

            <div className="col-span-1 md:col-span-8 lg:col-span-9 p-2 sm:p-4 md:p-6 lg:px-10"
                style={{
                maxWidth: '100%',
                width: '100vw',
                maxHeight: '100%',
                height: '100%',
                background: '#282726',
                borderRadius: '7px',
                }}
            >

                <div className="flex justify-between items-center py-2">
                        <label className="text-white font-medium">Filter by Status:</label>
                        <select
                        className="border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                        <option value="">All</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Denied">Denied</option>
                        <option value="Completed">Completed</option>
                        </select>
                </div>
                
                <div
                  className="w-full min-h-[600px] rounded-md pt-5"
                  style={{ background: "#d9d9d9" }}
                >
                     <div className="overflow-x-auto">
                        <table className="w-full text-center table-auto border border-gray-300 shadow-md rounded-lg">
                        <thead className="bg-blue-200 text-gray-700">
                            <tr>
                            <th className="py-3 px-4 border-b text-lg font-semibold" colSpan={6}>
                                Consultation Records
                            </th>
                            </tr>
                            <tr className="bg-blue-100">
                            <th className="py-2 px-4 ">ID Number</th>
                            <th className="py-2 px-4 ">Student Name</th>
                            <th className="py-2 px-4 ">Date</th>
                            <th className="py-2 px-4 ">Time</th>
                            <th className="py-2 px-4 ">Status</th>
                            <th className="py-2 px-4 ">Consultation Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                            filteredRequests.map((request, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                                <td className="py-2 px-4 ">{request.id_number}</td>
                                <td className="py-2 px-4 ">
                                    {request.firstname} {request.lastname}
                                </td>
                                <td className="py-2 px-4 ">{request.appointment_date}</td>
                                <td className="py-2 px-4 ">
                                    {formatTime(request.appointment_time) || request.appointment_time}
                                </td>
                                <td className="py-2 px-4 ">{request.status}</td>
                                <td className="py-2 px-4    ">{request.appointment_type}</td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan={6} className="py-4 text-center text-gray-500">
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
        
    </div>
  )
}

export default Consultationrecord