import React, { useEffect, useState } from 'react';
import LogoSmall from '../assets/images/logosmall.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faCircleCheck, faCircleXmark, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/navbar';
import './style.css';
import quadsquare from '../assets/images/Vector.png';
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


function Home() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState<boolean>(false);
  const [status, setStatus] = useState('All');
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedReason, setSelectedReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false);

  const token = sessionStorage.getItem('authToken');

  const [appointmentData, setAppointmentData] = useState({
    status: "Confirmed",
    meet_link: "",
    mode: "online",
  })

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => fetchAppointments(token),
    retry: false,
    enabled: !!token,
  });

  console.log(data)


  const handleAccept = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${token}`,
    };
  
    try {
      const response = await axios.put(`/appointments/update/${selectedRequest.appointment_id}`, appointmentData, {
        headers: headers,
      });
  
      console.log('Appointment updated successfully:', response.data);
      setShowAcceptModal(false);
      setViewDetails(false);
      refetch();

    } catch (error) {
      console.error('Error updating appointment:', error.message);
      console.log(appointmentData)
    }
  };


  const handleReject = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${token}`, 
    };
  
    const statusData = {
      status: "Denied", 
    };
  
    try {
      const response = await axios.put(`/appointments/reject/${selectedRequest.appointment_id}`, JSON.stringify(statusData), {
        headers: headers,
      });
  
      console.log('Appointment updated successfully:', response.data);
      setShowAcceptModal(false);
      setViewDetails(false);
      refetch();  // Refetch the appointments after updating
  
    } catch (error) {
      console.error('Error updating appointment:', error.message);
    }
  };
    // Open the rejection modal
    const openRejectModal = () => {
      setShowRejectModal(true);
    };
  
    // Close the rejection modal without taking action
    const closeRejectModal = () => {
      setShowRejectModal(false);
    };
  

  const toggleMode = () => {
    const newIsOnline = !isOnline;
  
    setIsOnline(newIsOnline);
  
    setAppointmentData((prevData) => ({
      ...prevData,
      meet_link: newIsOnline ? prevData.meet_link : '', 
      mode_id: newIsOnline ? 1 : 2, 
    }));
  };
  
  const toggleExpansionStatus = () => {
    setIsStatusExpanded((prevState) => !prevState);
  };

  const toggleStatus = (newStatus: React.SetStateAction<string>) => {
    setStatus(newStatus);
    setIsStatusExpanded(false);
  };

  // const statusMap: Record<string, string> = {
  //   'Available': 'Pending',   
  //   'Unavailable': 'Denied', 
  //   'All': 'All',            
  // };

  const filteredRequests = data?.filter((request: any) => 
    request.status === 'Pending'
  ) || [];

  console.log("filtered", filteredRequests)
  

  const handleRequestClick = (request: any) => {
    setSelectedRequest(request);
    setViewDetails(true);
  };

  const handleBackButtonClick = () => {
    setViewDetails(false);
    setSelectedRequest(null);
  };

  const handleReport = () => {
    alert('Reported');
    setShowReportModal(false);
  };


  return (
    <>
      <Header />

      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4 ">
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
                  background:
                    status === 'Available'
                      ? '#80E38A'
                      : status === 'Unavailable'
                      ? '#D96C6C'
                      : status === 'All'
                      ? ''
                      : '',
                      width: '100%'
                }}
              >
                {status === 'Available' || status === 'Unavailable' || status === 'All' ? (
                  <h1 className="pr-10 font-bold tracking-wider">{status}</h1>
                ) : (
                  <h1 className="pr-10 font-bold">Status</h1>
                )}
                <span style={{ position: 'absolute', right: '20px' }}>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transform transition-transform ${isStatusExpanded ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>

              {isStatusExpanded && (
                <div>
                  <div
                    className="flex justify-between items-center py-4 pt-1 pb-3 rounded-b"
                    style={{ width: '100%' }}
                    onClick={() => toggleStatus('All')}
                  >
                    <h1 className="text-md ml-3 font-normal">All</h1>
                  </div>
                  <div
                    className="flex justify-between items-center py-4 pt-1 pb-3 rounded-b"
                    style={{ width: '100%' }}
                    onClick={() => toggleStatus('Available')}
                  >
                    <h1 className="text-md ml-3 font-normal">Available</h1>
                    <div
                      className="mr-5"
                      style={{
                        width: '10px',
                        height: '10px',
                        background: '#15B31B',
                        borderRadius: '30px',
                        padding: '10px',
                      }}
                    ></div>
                  </div>

                  <div
                    className="flex justify-between items-center py-4 pt-1 pb-3 rounded-b"
                    style={{ width: '100%' }}
                    onClick={() => toggleStatus('Unavailable')}
                  >
                    <h1 className="text-md ml-3 font-normal">Unavailable</h1>
                    <div
                      className="mr-5"
                      style={{
                        width: '10px',
                        height: '10px',
                        background: '#CD1616',
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

          <div
            className="col-span-1 md:col-span-8 lg:col-span-9 p-2 sm:p-6 md:p-10 mb-2"
            style={{
              maxWidth: '100%',
              width: '100vw',
              height: 'auto',
              maxHeight: '100%',
              background: '#282726',
              borderRadius: '7px',
              position: 'relative',
            }}
          >
            <div
              className="py-5"
              style={{
                width: '100%',
                height: '72vh',
                maxHeight: '100%',
                background: '#D9D9D9',
                borderRadius: '7px',
                overflowY: 'scroll',
                position: 'relative'
              }}
            >
              {viewDetails ? (
                <div className='mx-20 md:mx-18 lg:mx-24 xl:mx-52 my-0' >
                  <button
                    onClick={handleBackButtonClick}
                    className=" text-white px-4 py-2 rounded hover:bg-slate-300"
                    style={{
                      border: '2px solid black',
                      position: 'absolute',
                      left: '10px',
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className='text-black' />
                  </button>
                  <div >

                    <div className=' flex items-center'>
                <div className='p-3 border-2 border-black rounded-full bg-white mr-3'>
                  <FontAwesomeIcon icon={faUser} className='text-2xl' aria-label="User Icon" />
                </div>
                        <div>
                          <h2 className="text-2xl font-bold">{selectedRequest.name}</h2>
                          <p className='text-lg font-bold text-gray-700' >id no: {selectedRequest?.id_number || '20xxxxxx'}
                          </p>
                        </div>

        
                    </div>

                    <div className='mt-2 text-right'>
                      <p className='text-base font-bold tracking-wide' >
                      {selectedRequest.appointment_timestamp} 

                      </p>
                      
                    </div>

                    <div className='py-10 px-5   bg-white p-2 h-96' style={{position: 'relative'}}  >
                          
                          <p className='' >{selectedRequest.reason}</p>
                          <div onClick={() => setShowReportModal(true)} className='py-2 px-5 mx-10 my-5'  style={{position: 'absolute', bottom: '0px', right: '0px', background: 'rgba(223, 22, 22, 1)', borderRadius: '7px', cursor: 'pointer'}}>
                            <h2 className='text-white'   >Report</h2>
                          </div>
                    </div>
                                
                    <div className="mt-3 lg:mx-24 flex flex-col md:flex-row justify-center md:justify-around items-center gap-4">

                    <div className='text-white text-center py-3 md:px-6 lg:px-10 w-full md:w-auto' style={{background: 'rgba(33, 151, 38, 1)', borderRadius: '7px', cursor: 'pointer'}} onClick={() => setShowAcceptModal(true)}>
                      <div>
                        <FontAwesomeIcon className='text-2xl' icon={faCircleCheck} />
                      </div>
                      <h2 className='font-bold tracking-wide text-base'>ACCEPT</h2>
                    </div>

                    <div className='text-white text-center py-3 md:px-6 lg:px-10 w-full md:w-auto' style={{background: 'rgba(223, 22, 22, 1)', borderRadius: '7px', cursor: 'pointer'}} onClick={openRejectModal}>
                      <div>
                        <FontAwesomeIcon className='text-2xl' icon={faCircleXmark} />
                      </div>
                      <h2 className='font-bold tracking-wide text-base'>REJECT</h2>
                    </div>

                    </div>


                      {/* Accept Modal */}
                      {showAcceptModal && (
                        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4' style={{zIndex: '2'}}>
                          <div className='relative bg-gray-200 rounded shadow-lg w-full max-w-md p-5'>
                            <button
                              onClick={() => setShowAcceptModal(false)}
                              className='absolute top-2 right-2 text-black p-2 bg-gray-300 rounded hover:bg-gray-400 '
                            >
                              <FontAwesomeIcon icon={faX} />
                            </button>

                            <div className='flex items-center justify-center mb-4'>
                              <div className='bg-white px-5 py-3 rounded-md'>
                                <div
                                  onClick={toggleMode}
                                  className={`relative w-24 h-10 flex items-center rounded-full cursor-pointer transition-all duration-300 `}
                                  style={{
                                    background: isOnline ? 'rgba(225, 199, 107, 0.75)' : 'rgba(9, 36, 46, 1)'
                                  }}
                                >
                                  <div
                                    className={`absolute w-8 h-6 rounded-md shadow-md transform transition-transform duration-300 ${
                                      isOnline ? 'translate-x-14' : 'translate-x-2'
                                    }`}
                                    style={{
                                      background: isOnline ? 'rgba(9, 36, 46, 1)' : 'rgba(225, 199, 107, 0.75)'
                                    }}
                                  ></div>
                                  <span className={`absolute left-2 text-sm font-semibold text-black ${isOnline ? 'opacity-100' : 'opacity-0'}`}>Online</span>
                                  <span className={`absolute right-2 text-sm font-semibold text-white ${isOnline ? 'opacity-0' : 'opacity-100'}`}>Onsite</span>
                                </div>
                              </div>
                            </div>

                            <p className='bg-white rounded-md p-5 h-48 mb-5'>{selectedRequest.reason}</p>

                            {isOnline && (
                              <input className='bg-white rounded-md p-3 mb-5 w-full border-black' value={appointmentData.meet_link} type="text" placeholder="Enter a zoom link"
                              onChange={(e) => {
                                setAppointmentData({
                                  ...appointmentData, meet_link: e.target.value
                                })
                              }}
                              />

                            )}
                            <div className='flex justify-center'>
                              <button className='px-4 py-2 bg-green-500 text-white rounded' onClick={handleAccept}>OK</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Report Modal */}
                      {showReportModal && (
                        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4'>
                          <div className='relative bg-gray-200 rounded shadow-lg w-full max-w-md p-5'>
                            <button
                              onClick={() => setShowReportModal(false)}
                              className='absolute top-2 right-2 text-black p-2 bg-gray-300 rounded hover:bg-gray-400'
                            >
                              <FontAwesomeIcon icon={faX} />
                            </button>

                            <h2 className='text-lg font-bold mb-4'>Report Appointment</h2>

                            <div className='space-y-4 mb-4'>
                              <label className='flex items-center space-x-3'>
                                <input 
                                  type='radio' 
                                  name='reportReason' 
                                  value='hateSpeech' 
                                  className='form-radio h-5 w-5 text-red-500' 
                                  onChange={(e) => setSelectedReason(e.target.value)} 
                                />
                                <span className='text-black'>Hate Speech</span>
                              </label>

                              <label className='flex items-center space-x-3'>
                                <input 
                                  type='radio' 
                                  name='reportReason' 
                                  value='bullying' 
                                  className='form-radio h-5 w-5 text-red-500' 
                                  onChange={(e) => setSelectedReason(e.target.value)} 
                                />
                                <span className='text-black'>Bullying/Harassment</span>
                              </label>

                              <label className='flex items-center space-x-3'>
                                <input 
                                  type='radio' 
                                  name='reportReason' 
                                  value='violentContent' 
                                  className='form-radio h-5 w-5 text-red-500' 
                                  onChange={(e) => setSelectedReason(e.target.value)} 
                                />
                                <span className='text-black'>Violent Content</span>
                              </label>

                              <label className='flex items-center space-x-3'>
                                <input 
                                  type='radio' 
                                  name='reportReason' 
                                  value='selfHarm' 
                                  className='form-radio h-5 w-5 text-red-500' 
                                  onChange={(e) => setSelectedReason(e.target.value)} 
                                />
                                <span className='text-black'>Self-Harm Content</span>
                              </label>
                            </div>

                            <div className='flex justify-center'>
                              <button 
                                className='px-4 py-2 bg-red-500 text-white rounded' 
                                onClick={handleReport}
                                disabled={!selectedReason}
                              >
                                Report
                              </button>
                            </div>
                          </div>
                        </div>

                      )}

                        {/* Modal for rejection confirmation */}
                      {showRejectModal && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                          style={{ backdropFilter: 'blur(5px)' }}
                        >
                          <div
                            className="bg-white p-6 rounded-lg max-w-sm w-full"
                            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                          >
                            <h2 className="text-center text-lg font-semibold mb-4">Are you sure you want to reject this request?</h2>
                            <div className="flex justify-center space-x-4">
                              <button
                                onClick={handleReject}
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={closeRejectModal}
                                className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <div id="ListofConsultationRequest">
                  {filteredRequests && filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <div
                        key={request.id}
                        className="grid grid-cols-1 md:grid-cols-7 items-center p-5 mb-2 bg-white hover:bg-indigo-400 cursor-pointer"
                        onClick={() => handleRequestClick(request)}
                      >
                        <div className="col-span-2 px-0 md:px-6 flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
                          <span
                            className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 md:mr-5 rounded-full"
                            style={{
                              background:
                                request.status === 'De'
                                  ? 'rgba(205, 22, 22, 1)'
                                  : request.status === 'Unavailable'
                                  ? 'rgba(21, 179, 27, 1)' 
                                  : 'rgba(217, 108, 108, 1)',
                              flexShrink: 0,
                            }}
                          ></span>

                          <span
                            className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 md:mr-2 md:ml-2 lg:ml-5 rounded-full"
                            style={{
                              background: 'rgba(40, 39, 38, 1)',
                              flexShrink: 0,
                            }}
                          ></span>

                          <h1 className="text-lg font-bold truncate max-w-[200px]">
                            {request.firstname} {request.lastname}
                          </h1>
                        </div>
                        <p className="col-span-4 truncate whitespace-nowrap overflow-hidden smallcenter">
                          {request.reason}
                        </p>
                        <span className="text-center font-bold">
                          {request.appointment_timestamp}
                        </span>
                      </div>
                    ))
                  ) : (
                    // Display this if filteredRequests is empty
                    <p className="text-center text-gray-500 py-5">No Requests Available</p>
                  )}
                </div>


              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;