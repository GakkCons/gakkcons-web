import React, { useState } from 'react';
import LogoSmall from '../../assets/images/logosmall.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import '../style.css';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();  // Access TanStack query client
  
  // Get the user type from sessionStorage or query cache
  const userType = sessionStorage.getItem('userType') || queryClient.getQueryData(['userType']);

  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };
  
  const handleLogout = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userType');
    
    // Clear TanStack Query cache
    queryClient.removeQueries(['authToken']);
    queryClient.removeQueries(['userType']);
    
    navigate('/');
  };

  return (
    <>
      <div className="mr-10 mt-5 logo">
        <div className="flex items-center">
          <img src={LogoSmall} alt="logo" className="w-30 h-1/12" />
          <h1 className="m-0 p-0 text-5xl font-black font-montserrat" style={{ letterSpacing: '2px' }}>
            GakkCons
          </h1>
        </div>
      </div>

      <div className="flex items-center dropdowncontainer">
        <div
          style={{
            border: '1px solid black',
            borderRadius: '7px',
            width: '300px',
            position: 'absolute',
            top: '60px',
            right: '20px',
          }}
          className="dropdownlist"
        >
          <div className="flex items-center p-3 cursor-pointer" onClick={toggleExpansion}>
            <div
              className="mr-3"
              style={{
                width: '10px',
                height: '10px',
                background: '#282726',
                borderRadius: '30px',
                padding: '10px',
              }}
            ></div>
            <h1 
              className="pr-10" 
              style={{ textTransform: 'capitalize' }}
            >
              {userType === 'faculty' 
                ? 'Teacher' 
                : userType === 'admin' 
                  ? 'Admin' 
                  : userType || 'User'}
            </h1>

            <span style={{ position: 'absolute', right: '10px' }}>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </span>
          </div>

          {/* Expanded Content Inside */}
          {isExpanded && (
            <div className="px-4 pt-1 pb-3 rounded-b" style={{ width: '100%' }}>
              <button className="text-sm font-semibold" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
