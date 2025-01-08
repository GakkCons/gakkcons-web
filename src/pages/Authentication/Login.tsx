import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../plugins/axios';
import { useNavigate } from 'react-router';
import Error from '../components/error';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();  
  const [showLogoScreen, setShowLogoScreen] = useState<boolean>(true);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({ email: 'jaydemike21@gmail.com', password: 'qwerty123' });

  const [email, setEmail] = useState('');

  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false); 
  const [errorMessage, setErrorMessage] = useState<string>(''); 


  const authToken = queryClient.getQueryData(['authToken']) || sessionStorage.getItem('authToken');

  useEffect(() => {
    if (authToken) {
      navigate('/home');
    }
  }, [authToken, navigate]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/users/login', data);
      return response.data;  
    },
    onSuccess: (response) => {
      console.log('Login successful:', response);

      if (response.userType !== 'admin' && response.userType !== 'faculty') {
        setErrorMessage('Access denied: Your account does not have the required permissions.');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userType');
        queryClient.removeQueries(['authToken']);
        queryClient.removeQueries(['userType']);
        setIsErrorOpen(true);  
        return; 
      }

      sessionStorage.setItem('authToken', response.token);
      sessionStorage.setItem('userType', response.userType);

      queryClient.setQueryData(['authToken'], response.token);
      queryClient.setQueryData(['userType'], response.userType);

      navigate('/home');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    
      if (error.response && error.response.data) {
        setErrorMessage(`Login failed: ${error.response.data.message}`);
      } else if (error.message) {
        setErrorMessage(`Login failed: ${error.message}`);
      } else {
        setErrorMessage("Login failed: An unexpected error occurred.");
      }
    
      setIsErrorOpen(true); 
    },
    
  });

  const handleLogin = () => {
    loginMutation.mutate();  // Trigger the login mutation
  };

  // forgot password - send email
  const handleForgotPassword = () => {
    console.log(email);
  }


  // Logo screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogoScreen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (showLogoScreen) {
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-[#FFFFFF]">
        <img src={logo} className="max-w-full h-auto" alt="logo" />
      </div>
    );
  }
  const closeErrorModal = () => {
    setIsErrorOpen(false); // Close error modal
    setErrorMessage(''); // Clear the error message
  };

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
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          <div className="mb-5 relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
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
            <a href="#" className="text-black underline text-sm" onClick={() => setIsModalOpen(true)}>
              Forgot Password?
            </a>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg min-w-[500px]">
                <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
                <p className="text-gray-700 text-md mb-4">
                  Enter your email address to receive a password reset link.
                </p>

                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleModalToggle}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleForgotPassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-right">
            <button
              className="w-40 bg-black text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              onClick={handleLogin}
              disabled={loginMutation.isLoading}  // Disable button while loading
            >
              {loginMutation.isLoading ? 'Loading...' : 'LOGIN'}
            </button>
          </div>
          <Error isOpen={isErrorOpen} onClose={closeErrorModal} message={errorMessage} />

        </div>
      </div>
    </div>
  );
};

export default Login;
