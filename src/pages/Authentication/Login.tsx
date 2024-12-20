import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login: React.FC = () => {
  const [showLogoScreen, setShowLogoScreen] = useState<boolean>(true);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogoScreen(false);
    }, 5000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);

  if (showLogoScreen) {
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-[#FFFFFF]">
        <img src={logo} className="max-w-full h-auto" alt="logo" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#fff]">
      <div className="bg-[#E3E1D9] flex flex-col md:flex-row justify-center items-center w-full max-w-4xl p-6">
        <div className="p-4 flex justify-center mb-6 md:mb-0">
          <img src={logo} className="object-cover h-100 w-100" alt="logo" />
        </div>

        <div className="p-6 w-full md:w-[400px] mb-6">
          <h1 className="text-4xl font-bold mb-6">SIGN IN</h1>

          <div className="mb-5">
            <input
              type="text"
              id="email"
              placeholder="Email/School ID"
              className="w-full px-4 py-2 border rounded-lg border-black text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-5 relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg border-black text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
              {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
            </button>
          </div>

          <div className="text-right mb-6">
            <a href="#" className="text-black underline text-sm">Forgot Password?</a>
          </div>

          <div className='text-right'>
            <button className=" w-40 bg-black text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
              <a href="/home">LOGIN</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
