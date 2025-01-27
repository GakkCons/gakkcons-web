import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/navbar';
import Header from './components/header';
import { useQuery } from '@tanstack/react-query';
import axios from '../pages/plugins/axios'

// Function to fetch appointments
const fetchAppointments = async (token: string) => {
  const response = await axios.get('/appointments', {
    headers: {
      'Authorization': `Bearer ${token}`, // Use the actual token here
    },
  });
  return response.data;
};

function ConsultationQueue() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState<boolean>(false);
  const [status, setStatus] = useState('');
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [expandedReasonId, setExpandedReasonId] = useState<number | null>(null);



  const token = sessionStorage.getItem('authToken');

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => fetchAppointments(token),
    retry: false,
    enabled: !!token,
  });

console.log("data", data)

  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const toggleExpansionStatus = () => {
    setIsStatusExpanded((prevState) => !prevState);
  };


  const toggleStatus = (newStatus: React.SetStateAction<string>) => {
    setStatus(newStatus);
    setIsStatusExpanded(false);
  };

  const [filterType, setFilterType] = useState(''); 
  const toggleDoneModal = () => setShowDoneModal((prev) => !prev);
 // Filter the requests by status and type
 const filteredRequests = data?.filter((request: any) => 
  request.status === 'Confirmed' && 
  (filterType ? request.appointment_type === filterType : true)
) || [];

// Group appointments by date
const groupedAppointments = filteredRequests.reduce((acc: any, request: any) => {
  const date = new Date(request.appointment_timestamp);
  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (!acc[dateString]) acc[dateString] = [];
  acc[dateString].push(request);
  return acc;
}, {});

// Sort the grouped appointments by date
const sortedGroupedAppointments = Object.keys(groupedAppointments)
  .sort((a, b) => new Date(a) - new Date(b)) // Sort by date
  .reduce((acc: any, key: string) => {
    acc[key] = groupedAppointments[key];
    return acc;
  }, {});


  
  const handleDone = async (appointment_id: number) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${token}`, 
    };
  
    const statusData = {
      status: "Completed", 
    };
  
    try {
      const response = await axios.put(`/appointments/completed/${appointment_id}`, JSON.stringify(statusData), {
        headers: headers,
      });
  
      console.log('Appointment updated successfully:', response.data);
      setShowDoneModal(false);
      refetch();  // Refetch the appointments after updating
  
    } catch (error) {
      console.error('Error updating appointment:', error.message);
    }
  };

    // Open the rejection modal
    const openDoneModal = () => {
      setShowDoneModal(true);
    };

    // Close the rejection modal without taking action
    const closeDoneModal = () => {
      setShowDoneModal(false);
    };
    
  
  return (
    <>
      <Header />
      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4 mb-2 ">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-4 lg:col-span-3 detail-status" style={{position: 'relative'}}>
               
                  <Navbar />

          </div>

          <div className="col-span-1 md:col-span-8 lg:col-span-9  p-2 sm:p-4 md:p-6 lg:px-10 "
      style={{
        maxWidth: '100%',
        width: '100vw',
        maxHeight: '100%',
        height: '100%',
        background: '#282726',
        borderRadius: '7px',
      }}
    >

      {/* filter */}
      <div className="mb-4 float-right">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All</option>
          <option value="online">Online</option>
          <option value="onsite">Onsite</option>
        </select>
      </div>

              <div
                className=" p-2 sm:p-6 md:p-3"
                style={{
                  width: '100%',
                  height: '70vh',
                  maxHeight: '100%',
                  background: '#D9D9D9',
                  borderRadius: '7px',
                  overflowY: 'scroll',
                }}
              >
<div >
  {Object.keys(sortedGroupedAppointments).length === 0 ? (
    <p className="text-center text-gray-500">No Requests Available</p>
  ) : (
    Object.keys(sortedGroupedAppointments).map((date, index) => (
      <div key={index}>
        <h2 className="text-lg font-bold mb-2">{date}</h2>
        <div className="overflow-x-auto">
          {sortedGroupedAppointments[date].map((request) => (
            <div key={request.appointment_id} className="h-auto p-1 bg-[#d1c8c3] rounded-lg mb-2">
              <div className="grid grid-cols-6 gap-4 textc items-center m-2">
                <div className="col-span-2 flex items-center gap-4">
                  <div className="p-3 border-2 border-black rounded-full">
                    <FontAwesomeIcon icon={faUser} className="text-2xl" aria-label="User Icon" />
                  </div>
                  <p className="text-sm font-bold">{request.firstname} {request.lastname}</p>
                </div>
                <div className="text-center">
                  <h1 className="font-bold text-1xl tracking-wider text-green-700">
                    {new Date(request.appointment_timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }).replace(/\s/, '')}
                  </h1>
                </div>
                <div className="text-center col-span-2">
                  <h1 className="text-sm font-medium" style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {request.reason.length > 10 ? (
                      <>
                        {expandedReasonId === request.appointment_id
                          ? request.reason
                          : request.reason.substring(0, 40) + '...'}
                        <button
                          onClick={() => {
                            setExpandedReasonId(expandedReasonId === request.appointment_id ? null : request.appointment_id);
                          }}
                          className="text-blue-500 ml-2"
                        >
                          {expandedReasonId === request.appointment_id ? 'See Less' : 'See More'}
                        </button>
                      </>
                    ) : (
                      request.reason
                    )}
                  </h1>
                </div>
                <div className="flex justify-center">
                  <button
                    className="px-3 py-1 rounded-md bg-green-700 text-white"
                    aria-label="Mark as done"
                    onClick={toggleDoneModal} // Open modal
                  >
                    Done
                  </button>
                </div>
              </div>

              {showDoneModal && (
                <div
                  className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
                  style={{ backdropFilter: 'blur(1px)' }}
                >
                  <div
                    className="bg-white p-6 rounded-lg max-w-sm w-full"
                    style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                  >
                    <h2 className="text-center text-lg font-semibold mb-4">Are you sure you want to complete this request?</h2>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleDone(request.appointment_id)} // Pass appointment_id
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={toggleDoneModal}
                        className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ))
  )}
</div>

              </div>
        </div>


      </div>
    </div>



    </>
  );
}

export default ConsultationQueue;



