import React, { useState } from 'react';
import LogoSmall from '../assets/images/logosmall.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons';
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

  const token = sessionStorage.getItem('authToken');

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => fetchAppointments(token),
    retry: false,
    enabled: !!token,
  });

console.log(data)

  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const toggleExpansionStatus = () => {
    setIsStatusExpanded((prevState) => !prevState);
  };

  const filteredRequests = data?.filter((request: any) => 
    request.status === 'Confirmed'
  ) || [];

  console.log(filteredRequests)

  const toggleStatus = (newStatus: React.SetStateAction<string>) => {
    setStatus(newStatus);
    setIsStatusExpanded(false);
  };


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
                {/* <div

                  style={{
                    position: 'absolute',
                    width: '100%',
                    background: '#D9D9D9',
                    border: '1px solid black',
                    borderRadius: '7px',
                  }}
                >
                  <div
                    className="flex items-center p-3 cursor-pointer"
                    onClick={toggleExpansionStatus}
                    style={{
                      background: status === 'Available' ? '#80E38A' : status === 'Unavailable' ? '#D96C6C' : '', // Conditional background color
                    }
                    }

                  >
                    {status === 'Available' || status === 'Unavailable' ? (
                      <h1 className="pr-10 font-bold tracking-wider" >{status}</h1>
                    ) : (
                      <h1 className="pr-10 font-bold ">Status</h1>  // This is the else condition
                    )}
                    <span style={{ position: 'absolute', right: '20px' }}>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`transform transition-transform ${isStatusExpanded ? 'rotate-180' : ''}`}
                      />
                    </span>
                    
                </div>



                  {isStatusExpanded && (
                    <div  >
                      <div
                        className="flex justify-between items-center py-4 pt-1 pb-3 rounded-b"
                        style={{ width: '100%' }}
                        onClick={() => toggleStatus('Available')} // Toggle to Available
                      >
                        <h1 className="text-md ml-3 font-normal">Available</h1>
                        <div
                          className="mr-5"
                          style={{
                            width: '10px',
                            height: '10px',
                            background:  '#15B31B',
                            borderRadius: '30px',
                            padding: '10px',
                          }}
                        ></div>
                      </div>

                      <div
                        className="flex justify-between items-center py-4 pt-1 pb-3 rounded-b"
                        style={{ width: '100%' }}
                        onClick={() => toggleStatus('Unavailable')} // Toggle to Unavailable
                      >
                        <h1 className="text-md ml-3 font-normal">Unavailable</h1>
                        <div
                          className="mr-5"
                          style={{
                            width: '10px',
                            height: '10px',
                            background:'#CD1616' ,
                            borderRadius: '30px',
                            padding: '10px',
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                </div> */}
                <Navbar />

        </div>

        <div className="col-span-1 md:col-span-8 lg:col-span-9  p-2 sm:p-4 md:p-6 lg:p-10 "
    style={{
      maxWidth: '100%',
      width: '100vw',
      maxHeight: '100%',
      height: '100%',
      background: '#282726',
      borderRadius: '7px',
    }}
  >
    <div
      className=" p-2 sm:p-6 md:p-10"
      style={{
        width: '100%',
        height: '70vh',
        maxHeight: '100%',
        background: '#D9D9D9',
        borderRadius: '7px',
        overflowY: 'scroll',
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ">

      {filteredRequests && filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <div key={request.appointment_id} className="h-auto p-3 bg-[#d1c8c3] rounded-lg">
            <h1 className="text-2xl font-bold text-center">Student</h1>

            <div className="flex justify-center items-center gap-1 m-2">
              <div className="text-center  mx-1 w-28">
                <div className='p-3 m-auto border-2 border-black rounded-full'>
                  <FontAwesomeIcon icon={faUser} className='text-2xl' aria-label="User Icon" />
                </div>
                <p className="text-sm font-bold">{request.firstname} {request.lastname}</p>
              </div>

              <div className="bg-white px-5 py-8 rounded-lg text-center">
                <h1 className="font-bold text-1xl tracking-wider text-green-700">
                  CONSULTATION ONGOING
                </h1>
              </div>
            </div>

            <div className="flex justify-end mr-2">
              <button
                className="px-3 py-1 rounded-md bg-green-700 text-white"
                aria-label="Mark as done"
                onClick={openDoneModal  } // Pass appointment_id
              >
                Done
              </button>
            </div>
            {showDoneModal && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                          style={{ backdropFilter: 'blur(5px)' }}
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
                                onClick={closeDoneModal}
                                className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
          </div>
        ))
      ) : (
        <p className=" text-center text-gray-500 ">No Requests Available</p>
        
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
