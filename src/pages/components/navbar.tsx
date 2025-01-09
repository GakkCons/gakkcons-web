
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';  // Updated import for 'react-router-dom'
import addmessageicon from '../../assets/images/addmessage.png';
import checklist from '../../assets/images/listchecklist.png';
import profilelogo from '../../assets/images/profilelogo.png';
import report from '../../assets/images/barchar.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();  // Track the current path
  const userType = sessionStorage.getItem('userType');  // Get userType from sessionStorage (or query client if you're using TanStack query)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="m-0" style={{ width: '100%' }}>
      <div className="flex flex-col">
        <div className="flex-grow">
          <ul className="flex flex-col space-y-1 mt-4">
            <li>
              <Link
                to="/home"
                className={`block shadow text-black hover:bg-blue-700 ${
                  location.pathname === '/home' ? 'border-l-8 border-black bg-blue-100' : ''
                }`}
                style={{ borderRadius: '7px' }}
              >
                <div className="flex content-between items-center p-3">
                  <img
                    src={addmessageicon}
                    style={{ width: '30px', height: '30px' }}
                    className="ml-1 mr-2"
                    alt=""
                  />
                  <h1 className="text-lg font-bold">Consultation Request</h1>
                </div>
              </Link>
            </li>

            <li>
              <Link
                to="/consultationqueue"
                className={`block shadow text-black hover:bg-blue-700 ${
                  location.pathname === '/consultationqueue' ? 'border-l-8 border-black bg-blue-100' : ''
                }`}
                style={{ borderRadius: '7px' }}
              >
                <div className="flex content-between items-center p-3">
                  <img
                    src={checklist}
                    style={{ width: '30px', height: '30px' }}
                    className="ml-1 mr-2"
                    alt=""
                  />
                  <h1 className="text-lg font-bold">Consultation Queue</h1>
                </div>
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className={`block shadow text-black hover:bg-blue-700 ${
                  location.pathname === '/profile' ? 'border-l-8 border-black bg-blue-100' : ''
                }`}
                style={{ borderRadius: '7px' }}
              >
                <div className="flex content-between items-center p-3">
                  <img
                    src={profilelogo}
                    style={{ width: '30px', height: '30px' }}
                    className="ml-1 mr-2"
                    alt=""
                  />
                  <h1 className="text-lg font-bold">Profile</h1>
                </div>
              </Link>
            </li>

            {/* Conditionally render Report link for admins */}
            {userType === 'admin' && (
              <li style={{ marginTop: '40px' }}>
                <Link
                  to="/report"
                  className={`block shadow text-black hover:bg-blue-700 ${
                    location.pathname === '/report' ? 'border-l-8 border-black bg-blue-100' : ''
                  }`}
                  style={{ borderRadius: '7px' }}
                >
                  <div className="flex content-between items-center p-3">
                    <img
                      src={report}
                      style={{ width: '30px', height: '30px' }}
                      className="ml-1 mr-2"
                      alt=""
                    />
                    <h1 className="text-lg font-bold">Report Status</h1>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
