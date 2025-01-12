// import React, { useState, useEffect } from 'react';
// import LogoSmall from '../assets/images/logosmall.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChartSimple, faChevronDown, faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import Navbar from './components/navbar';
// import { useQuery } from '@tanstack/react-query';
// import axios from './plugins/axios';
// import './style.css';
// import Header from './components/header';

// // Fetch data function
// const fetchAnalyticsData = async (token: string) => {
//   if (!token) {
//     throw new Error('No authentication token found');
//   }

//   try {
//     const response = await axios.get(
//       'appointments/get/analytics',
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, 
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error('Failed to fetch analytics data');
//   }
// };

// const getTeachers = async (token: string) => {
//   if (!token) {
//     throw new Error('No authentication token found');
//   }

//   try {
//     const response = await axios.get(
//       'teachers/',
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, 
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error('Failed to fetch analytics data');
//   }
// };


// function Report() {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const token = sessionStorage.getItem('authToken');
//   const [search, setSearch] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Fetch data using react-query
//   const { data, error, isLoading, refetch } = useQuery({
//     queryKey: ['analytics'],
//     queryFn: () => fetchAnalyticsData(token),
//     enabled: !!token,
//     retry: false,
//   });

  

//   // Fetch data using react-query
//   const { data: teachersData, error: teachersError, isLoading: teacherIsLoading } = useQuery({
//     queryKey: ['teachersdata'],
//     queryFn: () => getTeachers(token!),
//     enabled: !!token, // Only fetch if token exists
//     retry: false, // Don't retry on failure
//   });
//   console.log("Teachers Data", teachersData)
//   console.log("C Data", data)


  

//   const [filteredRequests, setFilteredRequests] = useState([]);

//   // Handle search input change
//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value.toLowerCase()); // Make search case-insensitive
//   };

//   // Filter the teachers based on the search query
//   const filteredTeachers = teachersData
//     ? teachersData.filter((teacher: any) =>
//         teacher.name.toLowerCase().includes(searchQuery) // Filter by name
//       )
//     : [];

//     console.log("filer", filteredTeachers)

//   useEffect(() => {
//     if (teachersData && teachersData.appointments) {
//       setFilteredRequests(filteredTeachers);
//     }
//   }, [teachersData]);



//   // Handle time formatting
//   const formatTime = (time) => {
//     const [hours, minutes] = time.split(':');
//     let hour = parseInt(hours, 10);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     hour = hour % 12;
//     hour = hour ? hour : 12; // the hour '0' should be '12'
//     return `${hour}:${minutes} ${ampm}`;
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;


//   return (
//     <>
//       <Header />

//       {/* Report Content */}
//       <div className="mx-2 sm:mx-4 md:mx-10 details mt-4">
//         {/* Handle Loading and Error States */}
//         <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
//           <div className="col-span-1 md:col-span-4 lg:col-span-3 detail-status" style={{ position: 'relative' }}>
//             <Navbar />
//           </div>

//           <div className="col-span-1 md:col-span-8 lg:col-span-9" style={{ maxWidth: '100%', width: '100%', maxHeight: '100%', height: 'auto', background: 'white', borderRadius: '7px' }}>
//             <div className="pb-2 px-2 flex flex-col md:flex-row justify-between items-center gap-4">
//               <div className="flex justify-start items-center gap-2">
//                 <h1 className="text-black text-xl sm:text-2xl tracking-wide font-semibold">
//                   Consultation Report Dashboard
//                 </h1>
//                 <FontAwesomeIcon className="text-xl sm:text-2xl text-black" icon={faChartSimple} />
//               </div>
//               <div className="flex items-center gap-4">
//               <div className="relative">
//                 <input
//                   className="p-2 w-96 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
//                   type="text"
//                   name="search"
//                   placeholder="Search Instructor"
//                   value={searchQuery}
//                   onChange={handleSearchChange} // Handle search input
//                 />
//                 <FontAwesomeIcon className="text-xl text-black absolute right-3 top-2.5" icon={faMagnifyingGlass} />
//               </div>

//                 <FontAwesomeIcon className="text-2xl text-black cursor-pointer" icon={faFilter} />
//               </div>
//             </div>


//       {/* Render loading, error, or teacher data */}
//       {teacherIsLoading && <p>Loading...</p>}
//       {teachersError && <p>Error: {teachersError.message}</p>}


//       {searchQuery ? (
// // teacher
//         <div className="p-2 md:p-10 mb-2" style={{ background: '#282726', borderRadius: '7px' }}>
//           <div className="flex justify-between items-center mb-2">
//             {/* Display teacher name from filteredTeachers */}
//             <h1 className="text-white text-2xl tracking-wide font-semibold">
//             {filteredTeachers.length > 0 
//           ? filteredTeachers[0].name
//               .toLowerCase()
//               .split(" ")
//               .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//               .join(" ")
//           : 'No Instructor Found'}
//             </h1>
//           </div>

//           <div className="p-4 md:p-1" style={{ borderRadius: 10, background: '#D1C8C3' }}>
//             {/* Appointment Cards based on filteredTeachers */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5 p-5">
//               {filteredTeachers.length > 0 && (
//                 <>
//                   <div className="bg-white shadow-md rounded-lg p-6">
//                     <p className="text-4xl text-right mb-5 font-bold text-gray-900 mt-2">
//                       {filteredTeachers[0].appointments.length}
//                     </p>
//                     <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
//                   </div>

//                   <div className="bg-green-100 shadow-md rounded-lg md:ml-2 p-6">
//                     <p className="text-4xl text-right mb-5 font-bold text-green-900 mt-2">
//                       {filteredTeachers[0].appointments.filter(appointment => appointment.status === 'Confirmed').length}
//                     </p>
//                     <h2 className="text-xl font-semibold text-green-700">Approved</h2>
//                   </div>

//                   <div className="bg-red-100 shadow-md rounded-lg p-6">
//                     <p className="text-4xl text-right mb-5 font-bold text-red-900 mt-2">
//                       {filteredTeachers[0].appointments.filter(appointment => appointment.status === 'Denied').length}
//                     </p>
//                     <h2 className="text-xl font-semibold text-red-700">Rejected</h2>
//                   </div>

//                   <div className="bg-blue-100 shadow-md rounded-lg p-6">
//                     <p className="text-4xl text-right mb-5 font-bold text-blue-900 mt-2">
//                       {filteredTeachers[0].appointments.filter(appointment => appointment.status === 'Pending').length}
//                     </p>
//                     <h2 className="text-xl font-semibold text-blue-700">Pending</h2>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Consultation Log */}
//             <div className="mx-5 mb-5 min-h-[700px] rounded-md px-5" style={{ background: 'rgba(40, 39, 38, 1)' }}>
//               <div className="flex justify-between items-center py-2">
//                 <h1 className="text-white font-bold text-2xl p-2">Consultation Approved Log</h1>
//               </div>

//               <div className="w-full min-h-[600px] rounded-md pt-5" style={{ background: 'white' }}>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-center table-auto">
//                     <thead>
//                       <tr>
//                         <th className="py-2 px-4">Date</th>
//                         <th className="py-2 px-4">Time</th>
//                         <th className="py-2 px-4">Consultation Mode</th>
//                         <th className="py-2 px-4">Instructor</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                     {filteredTeachers.length > 0 && filteredTeachers[0].appointments.length > 0 ? (
//                       filteredTeachers[0].appointments
//                         .filter((request) => request.status === "Confirmed") // Filter confirmed appointments
//                         .map((request) => (
//                           <tr key={request.appointment_id}>
//                     <td className="py-2 px-4">
//                       {new Date(request.scheduled_date).toISOString().split("T")[0]}
//                     </td>
//                     <td className="py-2 px-4">
//                       {new Date(request.scheduled_date).toLocaleTimeString('en-US', {
//                         hour: 'numeric',
//                         minute: '2-digit',
//                         hour12: true,
//                         timeZone: 'Asia/Manila', // Explicitly set Manila time
//                       })}
//                       </td>

//                               <td className="py-2 px-4 uppercase">{request.mode}</td>
//                               <td className="py-2 px-4 capitalize">
//                                 {filteredTeachers[0].name}
//                               </td>
//                             </tr>
//                           ))
//                       ) : (
//                         <tr>
//                           <td colSpan="4" className="text-center text-gray-500">No Requests Available</td>
//                         </tr>
//                       )}

//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (

//         // overall
//         <div className="p-2 md:p-10 mb-2" style={{ background: '#282726', borderRadius: '7px' }}>
//         <div className="flex justify-between items-center mb-2">
//           <h1 className="text-white text-2xl tracking-wide font-semibold">Overall Instructor</h1>
//         </div>
//         <div className="p-4 md:p-1" style={{ borderRadius: 10, background: '#D1C8C3' }}>
//           {/* Appointment Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5 p-5">
//             <div className="bg-white shadow-md rounded-lg p-6">
//               <p className="text-4xl text-right mb-5 font-bold text-gray-900 mt-2">{data.total_appointments}</p>
//               <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
//             </div>

//             <div className="bg-green-100 shadow-md rounded-lg md:ml-2 p-6">
//               <p className="text-4xl text-right mb-5 font-bold text-green-900 mt-2">{data.approved_appointments}</p>
//               <h2 className="text-xl font-semibold text-green-700">Approved</h2>
//             </div>

//             <div className="bg-red-100 shadow-md rounded-lg p-6">
//               <p className="text-4xl text-right mb-5 font-bold text-red-900 mt-2">{data.rejected_appointments}</p>
//               <h2 className="text-xl font-semibold text-red-700">Rejected</h2>
//             </div>

//             <div className="bg-blue-100 shadow-md rounded-lg p-6">
//               <p className="text-4xl text-right mb-5 font-bold text-blue-900 mt-2">{data.pending_appointments}</p>
//               <h2 className="text-xl font-semibold text-blue-700">Pending</h2>
//             </div>
//           </div>

//           {/* Consultation Log */}
//           <div className="mx-5 mb-5 min-h-[700px] rounded-md px-5" style={{ background: 'rgba(40, 39, 38, 1)' }}>
//             <div className="flex justify-between items-center py-2">
//               <h1 className="text-white font-bold text-2xl p-2">Consultation Approved Log</h1>
//             </div>

//             <div className="w-full min-h-[600px] rounded-md pt-5" style={{ background: 'white' }}>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-center table-auto">
//                   <thead>
//                     <tr>
//                       <th className="py-2 px-4">Date</th>
//                       <th className="py-2 px-4">Time</th>
//                       <th className="py-2 px-4">Consultation Mode</th>
//                       <th className="py-2 px-4">Instructor</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.appointments && data.appointments.length > 0 ? (
//                       data.appointments.map((request) => (
//                         <tr key={request.appointment_date}>
//                           <td className="py-2 px-4">{request.appointment_date}</td>
//                           <td className="py-2 px-4">{formatTime(request.appointment_time)}</td>
//                           <td className="py-2 px-4 uppercase">{request.consultation_mode}</td>
//                           <td className="py-2 px-4 capitalize">{request.instructor_first_name} {request.instructor_last_name}</td>
//                           </tr>
//                       ))
//                     ) : (
//                       <tr><td colSpan="4" className="text-center text-gray-500">No Requests Available</td></tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       )}



            
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Report;


import React, { useState, useEffect } from 'react';
import LogoSmall from '../assets/images/logosmall.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faChevronDown, faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/navbar';
import { useQuery } from '@tanstack/react-query';
import axios from './plugins/axios';
import './style.css';
import Header from './components/header';

// Fetch data function
const fetchAnalyticsData = async (token: string) => {
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get(
      'appointments/get/analytics',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch analytics data');
  }
};

const getTeachers = async (token: string) => {
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get(
      'teachers/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch teachers data');
  }
};

function Report() {
  const [isExpanded, setIsExpanded] = useState(false);
  const token = sessionStorage.getItem('authToken');
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data using react-query
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => fetchAnalyticsData(token),
    enabled: !!token,
    retry: false,
  });

  // Fetch teachers data
  const { data: teachersData, error: teachersError, isLoading: teacherIsLoading } = useQuery({
    queryKey: ['teachersdata'],
    queryFn: () => getTeachers(token!),
    enabled: !!token,
    retry: false,
  });

  console.log(data)
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
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return `${hour}:${minutes} ${ampm}`;
  };

  if (isLoading || teacherIsLoading) return <div>Loading...</div>;
  if (error || teachersError) return <div>Error: {error?.message || teachersError?.message}</div>;

  return (
    <>
      <Header />

      {/* Report Content */}
      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4">
        {/* Handle Loading and Error States */}
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-4 lg:col-span-3 detail-status" style={{ position: 'relative' }}>
            <Navbar />
          </div>

          <div className="col-span-1 md:col-span-8 lg:col-span-9" style={{ maxWidth: '100%', width: '100%', maxHeight: '100%', height: 'auto', background: 'white', borderRadius: '7px' }}>
            <div className="pb-2 px-2 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex justify-start items-center gap-2">
                <h1 className="text-black text-xl sm:text-2xl tracking-wide font-semibold">
                  Consultation Report Dashboard
                </h1>
                <FontAwesomeIcon className="text-xl sm:text-2xl text-black" icon={faChartSimple} />
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
                  <FontAwesomeIcon className="text-xl text-black absolute right-3 top-2.5" icon={faMagnifyingGlass} />
                </div>

                <FontAwesomeIcon className="text-2xl text-black cursor-pointer" icon={faFilter} />
              </div>
            </div>

            {/* Render teacher search results */}
            {searchQuery ? (
              <div className="p-2 md:p-10 mb-2" style={{ background: '#282726', borderRadius: '7px' }}>
                <div className="flex justify-between items-center mb-2" >
                  {/* Display teacher name from filteredTeachers */}
                  <h1 className="text-white text-2xl tracking-wide font-semibold">
                    {filteredTeachers.length > 0
                      ? filteredTeachers[0].name
                          .toLowerCase()
                          .split(' ')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                      : 'No Instructor Found'}
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 my-5 p-5" style={{ borderRadius: 10, background: '#D1C8C3' }} >
                  {filteredTeachers.length > 0 && (
                    <>
                      <div className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-6">
                        <p className="text-4xl text-right mb-5 font-bold text-gray-900 mt-2">
                          {filteredTeachers[0].appointments.length}
                        </p>
                        <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
                      </div>

                      <div className="bg-green-100 shadow-md rounded-lg md:ml-2 p-6">
                        <p className="text-4xl text-right mb-5 font-bold text-green-900 mt-2">
                          {filteredTeachers[0].appointments.filter((appointment) => appointment.status === 'Confirmed').length}
                        </p>
                        <h2 className="text-xl font-semibold text-green-700">Approved</h2>
                      </div>

                      <div className="bg-red-100 shadow-md rounded-lg p-6">
                        <p className="text-4xl text-right mb-5 font-bold text-red-900 mt-2">
                          {filteredTeachers[0].appointments.filter((appointment) => appointment.status === 'Denied').length}
                        </p>
                        <h2 className="text-xl font-semibold text-red-700">Rejected</h2>
                      </div>

                      <div className="bg-blue-100 shadow-md rounded-lg p-6">
                        <p className="text-4xl text-right mb-5 font-bold text-blue-900 mt-2">
                          {filteredTeachers[0].appointments.filter((appointment) => appointment.status === 'Pending').length}
                        </p>
                        <h2 className="text-xl font-semibold text-blue-700">Pending</h2>
                      </div>

                      <div className="bg-yellow-100 shadow-md rounded-lg p-6">
                        <p className="text-4xl text-right mb-5 font-bold text-yellow-900 mt-2">
                          {filteredTeachers[0].appointments.filter((appointment) => appointment.status === 'Completed').length}
                        </p>
                        <h2 className="text-xl font-semibold text-yellow-700">Completed</h2>
                      </div>
                    </>
                  )}
                </div>

                {/* Consultation Log */}
                <div className=" mb-5 min-h-[700px] rounded-md px-5" style={{ borderRadius: 10, background: '#D1C8C3' }}>
                  <div className="flex justify-between items-center py-2">
                    <h1 className="text-black font-bold text-2xl p-2">Consultation Approved Log</h1>
                  </div>

                  <div className="w-full min-h-[600px] rounded-md pt-5" style={{ background: 'white' }}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-center table-auto">
                        <thead>
                          <tr>
                            <th className="py-2 px-4">Date</th>
                            <th className="py-2 px-4">Time</th>
                            <th className="py-2 px-4">Consultation Mode</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTeachers.length > 0 &&
                            filteredTeachers[0].appointments.length > 0 ? (
                            filteredTeachers[0].appointments
                              .filter((request) => request.status === 'Confirmed')
                              .map((request) => (
                                <tr key={request.appointment_id}>
                                  <td className="py-2 px-4">{new Date(request.scheduled_date).toISOString().split('T')[0]}</td>
                                  <td className="py-2 px-4">
                                    {new Date(request.scheduled_date).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                      timeZone: 'Asia/Manila',
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
        <div className="p-2 md:p-10 mb-2" style={{ background: '#282726', borderRadius: '7px' }}>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-white text-2xl tracking-wide font-semibold">Overall Instructor</h1>
        </div>
        <div className="p-4 md:p-1" style={{ borderRadius: 10, background: '#D1C8C3' }}>
          {/* Appointment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 my-5 p-5">
            <div className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-6">
              <p className="text-4xl text-right mb-5 font-bold text-gray-900 mt-2">{data.total_appointments}</p>
              <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
            </div>

            <div className="bg-green-100 shadow-md rounded-lg md:ml-2 p-6">
              <p className="text-4xl text-right mb-5 font-bold text-green-900 mt-2">{data.approved_appointments}</p>
              <h2 className="text-xl font-semibold text-green-700">Approved</h2>
            </div>

            <div className="bg-red-100 shadow-md rounded-lg p-6">
              <p className="text-4xl text-right mb-5 font-bold text-red-900 mt-2">{data.rejected_appointments}</p>
              <h2 className="text-xl font-semibold text-red-700">Rejected</h2>
            </div>

            <div className="bg-blue-100 shadow-md rounded-lg p-6">
              <p className="text-4xl text-right mb-5 font-bold text-blue-900 mt-2">{data.pending_appointments}</p>
              <h2 className="text-xl font-semibold text-blue-700">Pending</h2>
            </div>

            <div className="bg-yellow-100 shadow-md rounded-lg p-6">
              <p className="text-4xl text-right mb-5 font-bold text-yellow-900 mt-2">{data.completed_appointments}</p>
              <h2 className="text-xl font-semibold text-yellow-700">Completed</h2>
            </div>
          </div>

          {/* Consultation Log */}
          <div className="mx-5 mb-5 min-h-[700px] rounded-md px-5" style={{ background: 'rgba(40, 39, 38, 1)' }}>
            <div className="flex justify-between items-center py-2">
              <h1 className="text-white font-bold text-2xl p-2">Consultation Approved Log</h1>
            </div>

            <div className="w-full min-h-[600px] rounded-md pt-5" style={{ background: 'white' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-center table-auto">
                  <thead>
                    <tr>
                      <th className="py-2 px-4">Date</th>
                      <th className="py-2 px-4">Time</th>
                      <th className="py-2 px-4">Consultation Mode</th>
                      <th className="py-2 px-4">Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.appointments && data.appointments.length > 0 ? (
                      data.appointments.map((request) => (
                        <tr key={request.appointment_date}>
                          <td className="py-2 px-4">{request.appointment_date}</td>
                          <td className="py-2 px-4">{formatTime(request.appointment_time)}</td>
                          <td className="py-2 px-4 uppercase">{request.consultation_mode}</td>
                          <td className="py-2 px-4 capitalize">{request.instructor_first_name} {request.instructor_last_name}</td>
                          </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="text-center text-gray-500">No Requests Available</td></tr>
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
