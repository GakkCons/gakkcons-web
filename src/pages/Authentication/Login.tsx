import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../plugins/axios";
import { useNavigate } from "react-router";
import Error from "../components/error";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showLogoScreen, setShowLogoScreen] = useState<boolean>(true);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false); // Modal for resetting password
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [registerVerify, setRegisterVerify] = useState({
    email: "",
    verificationCode: "",
    codeType: "signup_verify_user",
  });
  const [disableRegisterButton, setDisableRegisterButton] = useState(false);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const toggleVerificationModal = () => {
    setIsVerificationModalOpen(!isVerificationModalOpen);
  };

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegisterModalToggle = () => {
    setIsRegisterModalOpen(!isRegisterModalOpen);
  };

  const authToken =
    queryClient.getQueryData(["authToken"]) ||
    sessionStorage.getItem("authToken");

  useEffect(() => {
    if (authToken) {
      navigate("/home");
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
      const response = await axios.post("/users/login", {
        email,
        password: newPassword,
      });
      return response.data;
    },
    onSuccess: (response) => {
      sessionStorage.setItem("authToken", response.token);
      sessionStorage.setItem("userType", response.userType);
      queryClient.setQueryData(["authToken"], response.token);
      queryClient.setQueryData(["userType"], response.userType);

      // Check if the user is a student and restrict access
      if (response.userType === "student") {
        setErrorMessage("Access restricted for students.");
        setIsErrorOpen(true);
        // Clear sessionStorage
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userType");

        // Clear TanStack Query cache
        queryClient.removeQueries(['authToken']);
        queryClient.removeQueries(['userType']);
      } else if (response.userType === 'faculty') {
        navigate('/accounts');

      } else {
        navigate("/home");
      }
    },

    onError: (error: any) => {
      if (error.response.data.message === "User is not verified yet.") {
        alert("Your email is not yet verified.");
        setIsVerificationModalOpen(true);
        return;
      }
      console.log("Login failed:", error.response.data.message);
      setErrorMessage("Login failed: An unexpected error occurred.");
      setIsErrorOpen(true);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate();
  };

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      userType: string;
    }) => {
      const response = await axios.post("users/signup", userData);
      return response.data;
    },
    onSuccess: () => {
      alert("Registration successful!");
      handleRegisterModalToggle(); // Close the modal after success
      toggleVerificationModal(); // Open the verification modal
    },
    onError: (error: any) => {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      setErrorMessage("Registration failed. Please try again.");
    },
  });

  useEffect(() => {
    if (registerMutation.isPending) {
      setDisableRegisterButton(true);
    } else {
      setDisableRegisterButton(false);
    }
  }, [registerMutation.isPending]);

  const handleRegister = () => {
    const { firstName, lastName, email, password, confirmPassword } =
      registerData;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Clear error message before mutation
    setErrorMessage("");

    // Execute the mutation
    const userType = "faculty";
    registerMutation.mutate({ firstName, lastName, email, password, userType });
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post("users/verify", registerVerify);
      alert("Verification successful!");

      setRegisterVerify({
        email: "",
        verificationCode: "",
        codeType: "signup_verify_user",
      });

      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      console.log("Response:", response.data);
      alert('Account Successully Verified!')
      setIsVerificationModalOpen(false);


      // Add any additional logic after successful verification, e.g., closing modal
    } catch (error) {
      console.error(
        "Verification failed:",
        error.response?.data || error.message
      );
      alert("Verification failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    axios
      .post("users/password/forgot", { email })
      .then(() => {
        console.log("Password reset request sent");
        setIsModalOpen(false);
        setIsResetPasswordModalOpen(true); // Show reset password modal after sending email
      })
      .catch((error) => {
        console.error(
          "Error sending password reset request:",
          error.response?.data || error.message
        );
      });
  };

  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsErrorOpen(true);
      return;
    }

    axios
      .post("users/password/reset", {
        email,
        verificationCode,
        newPassword,
        confirmPassword,
      })
      .then((response) => {
        alert("Password reset successfully");

        // Automatically login the user after password reset
        loginMutation.mutate();

        setIsResetPasswordModalOpen(false); // Close modal after success
      })
      .catch((error) => {
        console.error(
          "Error resetting password:",
          error.response?.data || error.message
        );
      });
  };

  const closeErrorModal = () => {
    setIsErrorOpen(false);
    setErrorMessage("");
  };

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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value),
                  setRegisterVerify({
                    ...registerVerify,
                    email: e.target.value,
                  });
              }}
            />
          </div>

          <div className="mb-5 relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg border-black text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
              {passwordVisible ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>

          <div className="text-right mb-6">
            <a
              href="#"
              className="text-black underline text-sm"
              onClick={handleModalToggle}
            >
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

          {/* Reset Password Modal */}
          {isResetPasswordModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg min-w-[500px]">
                <h2 className="text-lg font-semibold mb-4">
                  Enter New Password
                </h2>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordReset}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-right">
            <button
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              onClick={handleLogin}
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? "Loading..." : "LOGIN"}
            </button>
          </div>

          <div className="text-right mt-5">
            <button
              style={{ color: "blue", fontSize: "16px" }}
              onClick={handleRegisterModalToggle}
            >
              Don't Have an Account? Register Here!
            </button>
          </div>

          {isRegisterModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg min-w-[500px]">
                <h2 className="text-lg font-semibold mb-4">Register</h2>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={registerData.firstName}
                    onChange={(e) => {
                      setRegisterData({
                        ...registerData,
                        firstName: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={registerData.lastName}
                    onChange={(e) => {
                      setRegisterData({
                        ...registerData,
                        lastName: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={(e) => {
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      });
                      setRegisterVerify({
                        ...registerVerify,
                        email: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={(e) => {
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Retype Password"
                    value={registerData.confirmPassword}
                    onChange={(e) => {
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    disabled={disableRegisterButton}
                    onClick={handleRegisterModalToggle}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={disableRegisterButton}
                    onClick={handleRegister}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}

          {isVerificationModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg min-w-[400px]">
                <h2 className="text-lg font-semibold mb-4">
                  Verify Your Email
                </h2>

                {errorMessage && (
                  <div className="text-red-500 text-sm mb-4">
                    {errorMessage}
                  </div>
                )}

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value),
                        setRegisterVerify({
                          ...registerVerify,
                          verificationCode: e.target.value,
                        });
                    }}
                    className="w-full px-4 py-2 border rounded-lg border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={toggleVerificationModal}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerification}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          )}

          <Error
            isOpen={isErrorOpen}
            onClose={closeErrorModal}
            message={errorMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
