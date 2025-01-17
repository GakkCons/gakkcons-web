import React, { useState, useEffect } from 'react';
import LogoSmall from '../assets/images/logosmall.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronDown, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/navbar';
import calendarIcon from '../assets/images/CRD.png'
import pictureIcon from '../assets/images/pictures.png'
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

const userType = sessionStorage.getItem('userType');  

const fetchProfile = async (token: string) => {
  const response = await axios.get('/users/profile', {
    headers: {
      'Authorization': `Bearer ${token}`, // Use the actual token here
    },
  });
  return response.data;
};



function Profile() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);
  const [status, setStatus] = useState('');
  const [activeButtons, setActiveButtons] = useState([]);
  const [profiledata, setprofiledata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    id_number: "",
    currentPassword: "",
    newPassword: ""
  })

  const [showupdatemodal, setShowUpdateModal] = useState(false);


  const openShowUpdateModal = () => {
    setShowUpdateModal(true);
  };

  // Close the rejection modal without taking action
  const closeShowUpdateModal = () => {
    setShowUpdateModal(false);
  };
  const token = sessionStorage.getItem('authToken');

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => fetchAppointments(token),
    retry: false,
    enabled: !!token,
  });
  
  const { data: profile, error: profileError, isLoading: isProfileLoading, refetch: profilerefetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(token),
    retry: false,
    enabled: !!token,
  });



  useEffect(() => {
    if (profile) {
      setActiveButtons([profile.mode]);
      // Set default id_number if it's null or empty
      setprofiledata((prevData) => ({
        ...prevData,
        id_number: profile.id_number || '20xxxxxx',
      }));
    }
  }, [profile]);
  


  const handleButtonClick = (mode) => {
    setActiveButtons([mode]);
  
    axios.put('/users/profile/mode/update', {
      preferMode: mode
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Use the actual token here
      }
    } )
    .then(response => {
      alert(`Prefer mode is set to "${mode}" mode.`);
    })
    .catch(error => {
      console.error('Error updating mode:', error);
    });
  };
  

  // Handle button click
  // const handleButtonClick = (button) => {
  //   // If the button clicked is already active, reset to null (unselect all)
  //   setActiveButton(activeButton === button ? null : button);
  // };
  const [isEdit, setIsEdit] = useState(false);

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

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    const formattedTime = `${hour}:${minutes} ${ampm}`;
    return formattedTime;
  };
  
  const filteredRequests = data?.filter((request: any) => 
    request.status === 'Confirmed'
  ) || [];  

  const handleUpdateProfile = () => {
    axios.put('/users/profile/update', profiledata, {
      headers: {
        'Authorization': `Bearer ${token}`, // Use the actual token here
      }
    })
    .then(response => {
      console.log('Profile updated successfully:', response.data);
      setprofiledata({
        firstName: "",
        lastName: "",
        email: "",
        id_number: "",
        currentPassword: "",
        newPassword: ""
      })
      profilerefetch();
      alert('Users Update Profile Successfully')
      setShowUpdateModal(false);
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      alert("Enter your new password")
    });
  };
  


  return (
    <>
      <Header />


      
      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4 mb-2 ">
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
      <div className="col-span-1 md:col-span-4 lg:col-span-3 detail-status" style={{position: 'relative'}}>
   
            <Navbar />
          </div>
            <div className="col-span-1 md:col-span-8 lg:col-span-9  pb-10 px-5 relative"
              style={{
                maxWidth: '100%',
                width: '100vw',
                background: 'rgba(217, 217, 217, 1)',
                borderRadius: '7px',
              }}
            >
              <div className='text-center mx-10 my-6 pt-5 sm:pt-5 lg:pt-0 xl:pt-0 md:pt-5 lg:absolute xl:absolute consultationmode' style={{ right: 0}}>
                <h1 className='text-2xl font-bold mb-2'>Consulation Mode:</h1>
                <div className="flex justify-center items-center">
                  <button
                    className={`font-bold ${activeButtons.includes('Onsite') ? 'bg-blue-500 text-white' : ''}`}
                    style={{
                      border: '2px solid black',
                      padding: '5px',
                      borderTopLeftRadius: '7px',
                      borderBottomLeftRadius: '7px',
                    }}
                    onClick={() => handleButtonClick('Onsite')}
                  >
                    Onsite
                  </button>

                  <button
                    className={` ${activeButtons.includes('Online/Onsite') ? 'bg-blue-500 text-white' : ''}`}
                    style={{
                      borderTop: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '7px',
                      background: 'rgba(9, 36, 46, 1)',
                    }}
                    onClick={() => handleButtonClick('Online/Onsite')}
                  >
                    <img
                      src={quadsquare} // Make sure `quadsquare` is properly defined or passed in
                      alt="quadsquare"
                      style={{ width: '20px', height: '20px', objectFit: 'cover' }}
                    />
                  </button>

                  <button
                    className={`font-bold ${activeButtons.includes('Online') ? 'bg-blue-500 text-white' : ''}`}
                    style={{
                      border: '2px solid black',
                      padding: '5px',
                      borderTopRightRadius: '7px',
                      borderBottomRightRadius: '7px',
                    }}
                    onClick={() => handleButtonClick('Online')}
                  >
                    Online
                  </button>
                </div>

              </div>

              {/* <div className="flex justify-center  md:pt-5  lg:pt-20 xl:pt-20 ">
                <div>
                    
                  <div className="w-48 h-48 bg-[#282726] rounded-full relative flex justify-center items-center">
                      <img src="" alt="" className="w-full h-full rounded-full object-cover" />

                      {isEdit ? (
                        <button 
                        className="absolute px-3 py-2 text-white rounded-md shadow-lg font-bold tracking-wide"
                        style={{bottom: '0px', background: 'rgba(155, 160, 161, 1)'}} 
                        onClick={() => {
                          setIsEdit(false)
                        }}
                      >
                          BACK
                      </button>
                      ) : (

                        <button 
                        className="absolute px-3 py-2 text-white rounded-md shadow-lg font-bold tracking-wide"
                        style={{bottom: '0px', background: 'rgba(155, 160, 161, 1)'}} 
                        onClick={() => {
                          setIsEdit(true)
                        }}
                      >
                        EDIT
                      </button>
                      )}



                    </div>


                    <div className='mt-5 text-center'>
                      <div className="mt-5 text-center">
                      <h1 className="text-2xl font-extrabold tracking-wide mb-1">{profile.first_name} {profile.last_name}</h1>
                
                      </div>

                      <p className='text-sm font-lightbold'>
                       
                          {profile?.email || '20xxxxxx'}
                      </p>
                      </div>
                  </div>
              </div> */}

<div className="flex justify-center mx-2 lg:mx-10 w-full h-96 items-center ">
  <div>
    <div className="w-48 h-48 bg-[#282726] rounded-full relative flex justify-center items-center">
      <img src="" alt="" className="w-full h-full rounded-full object-cover" />

      {isEdit ? (
        <button
          className="absolute px-3 py-2 text-white rounded-md shadow-lg font-bold tracking-wide"
          style={{ bottom: '0px', background: 'rgba(155, 160, 161, 1)' }}
          onClick={() => {
            setIsEdit(false);
          }}
        >
          Back
        </button>
      ) : (
        <button
          className="absolute px-3 py-2 text-white rounded-md shadow-lg font-bold tracking-wide"
          style={{ bottom: '0px', background: 'rgba(155, 160, 161, 1)' }}
          onClick={() => {
            setIsEdit(true);
          }}
        >
          Edit
        </button>
      )}
    </div>

    <div className="mt-5 ">
      <h1 className="text-2xl font-extrabold tracking-wide mb-1 pr-2">
        {profile?.first_name || ''} {profile?.last_name || ''}
      </h1>
      <p className="text-sm font-lightbold">{profile?.email || '20xxxxxx'}</p>
    </div>
  </div>
</div>


              {isEdit ? (
                <div className="flex justify-center px-4">
                  <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl min-h-[200px] mt-6 rounded-md p-4 bg-[#282726]">
                  <h1 className="text-lg text-white mb-4">User Information</h1>

                    {/* Form Container */}
                    <div className="w-full bg-white rounded-md p-4 mb-3">
                      
                      {/* Name Field */}
                      <div className="mb-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input 
                          type="text" 
                          placeholder={profile.first_name} 
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          
                          value={profiledata.firstName}
                          onChange={(e) => {
                            setprofiledata({
                              ...profiledata, firstName: e.target.value
                            })
                          }}
                        />
                      </div>

                      <div className="mb-2">
                        <input 
                          type="text" 
                          placeholder={profile.last_name}
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          value={profiledata.last_name}
                          onChange={(e) => {
                            setprofiledata({
                              ...profiledata, lastName: e.target.value
                            })
                          }}
                        />
                      </div>

                      <div className="mb-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input 
                          type="text" 
                          placeholder={profile.email}
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          value={profiledata.email}
                          onChange={(e) => {
                            setprofiledata({
                              ...profiledata, email: e.target.value
                            })
                          }}
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="idno" className="block text-sm font-medium text-gray-700 mb-1">
                          ID Number
                        </label>
                        <input 
                          type="text" 
                          placeholder={profile.id_number} 
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          value={profiledata.id_number}
                          onChange={(e) => {
                            setprofiledata({
                              ...profiledata, id_number: e.target.value
                            })
                          }}                          
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input 
                          type="text" 
                          placeholder="************" 
                          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          value={profiledata.newPassword}
                          onChange={(e) => {
                            setprofiledata({
                              ...profiledata, newPassword: e.target.value
                            })
                          }}                          
                        />
                      </div>

                    </div>

                    <div className='flex justify-center '>
                      <button className='text-white px-10 py-2 text-md font-bold tracking-wide rounded-md' style={{background: 'rgba(27, 108, 30, 1)'}}                       onClick={() => {
                          setShowUpdateModal(true)
                        }} >DONE</button>
                    </div>

                    {showupdatemodal && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                          style={{ backdropFilter: 'blur(5px)' }}
                        >
                          <div
                            className="bg-white p-6 rounded-lg max-w-sm w-full"
                            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                          >
                            <h2 className="text-center text-lg font-semibold mb-4">Enter your Current Password to Update your Profile</h2>
                            
                            <div className="mb-2">
                              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Current
                              </label>
                              <input 
                                type="text" 
                                placeholder={profiledata.currentPassword} 
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                onChange={(e) => {
                                  setprofiledata({
                                    ...profiledata, currentPassword: e.target.value
                                  })
                                }} 
                              />
                            </div>
                            
                            <div className="flex justify-center space-x-4">
                              <button
                                onClick={() => {
                                  // Check if the current password is provided
                                  if (!profiledata.currentPassword) {
                                    alert("Please enter your current password.");
                                    return;  // Prevent the update if password is not entered
                                  }
                                  handleUpdateProfile();  // Proceed with the profile update if the password is provided
                                }}
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={closeShowUpdateModal}
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
                <div className="w-full min-h-[700px]  rounded-md px-5 " style={{background: 'rgba(40, 39, 38, 1)'}} >
                  
                <div className="flex justify-between items-center py-2">
                  <h1 className='text-white font-bold w-1 '>Consultation Details</h1>
                  <img
                    src={calendarIcon}
                    style={{ width: '25px', height: '25px', objectFit: 'cover', cursor: 'pointer' }}
                  className="ml-1 mr-2"
                    alt=""
    
                  />
                </div>


                <div className='w-full min-h-[600px] rounded-md pt-5' style={{ background: 'rgba(209, 200, 195, 1)' }}>
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
      {filteredRequests && filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <tr>
          <td className="py-2 px-4">{request.appointment_date}</td>
          <td className="py-2 px-4">{formatTime(request.appointment_time) || request.appointment_time}</td>
          <td className="py-2 px-4">{request.appointment_type}</td>
        </tr>
        ))
      ) : (
        <p className=" text-center text-gray-500 " >No Requests Available</p>
 
      )}
                </tbody>

</table>        
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

export default Profile;
