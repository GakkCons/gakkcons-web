import React, { useState, useEffect } from "react";
import Header from "./components/header";
import Navbar from "./components/navbar";
import axios from "../pages/plugins/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchSubjects = async (token: string) => {
  const response = await axios.get("/users/subjects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchUsers = async (token: string) => {
  const response = await axios.get("/users/getUsers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateUserActivationStatus = async (userStatusToUpdate: {
  user_id: any;
  is_active: boolean;
}) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const response = await axios.put(
      "/users/activation-status/update",
      {
        user_id: userStatusToUpdate.user_id,
        is_active: userStatusToUpdate.is_active,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    alert(error.response?.data?.message || "Failed to update user status");
  }
};

function ManageAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState("select");
  const [data, setData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subjectId: "",
    id_number: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [selectedRole, setSelectedRole] = useState<string>(""); // State for role filter
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // Filtered users list

  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [userIdToDelete, setUserIdToDelete] = useState<any>(null);

  // const handleDeleteConfirmation = (userId: any) => {
  //   setUserIdToDelete(userId);
  //   setIsDeleteModalOpen(true);
  // };

  // const closeDeleteModal = () => {
  //   setIsDeleteModalOpen(false);
  //   setUserIdToDelete(null);
  // };

  const token: any = sessionStorage.getItem("authToken");

  const {
    data: subjects,
    error: subjectError,
    isLoading: isSubjetsLoading,
    refetch: subjectRefetch,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => fetchSubjects(token),
    retry: false,
    enabled: !!token,
  });

  const {
    data: users,
    error: usersError,
    isLoading: isUsersLoading,
    refetch: isUsersRefetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(token),
    retry: false,
    enabled: !!token,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (userStatusToUpdate: { user_id: any; is_active: boolean }) =>
      updateUserActivationStatus(userStatusToUpdate),
    onSuccess: (data) => {
      isUsersRefetch();
      console.log("User status updated successfully:", data);
      // Add any success toast or UI updates here
    },
    onError: (error: any) => {
      console.error("Error updating user status:", error.message);
      // Show an error toast
    },
  });

  useEffect(() => {
    if (users?.data) {
      // Set filtered users on load
      if (selectedRole) {
        setFilteredUsers(
          users.data.filter((user: any) => user.role_name === selectedRole)
        );
      } else {
        setFilteredUsers(users.data);
      }
    }
  }, [users, selectedRole]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStep("select");
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleUserTypeSelect = (userType: string) => {
    setData({ ...data, userType });
    setStep("register");
  };

  const handleRegisterTeacher = () => {
    axios
      .post("users/signupadmin", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Successfully Added User");
        setData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
        isUsersRefetch();
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error creating user account:", error);
      });
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    if (!selectedUser) return;

    // Only include password if it is set
    const userDataToUpdate = {
      ...selectedUser,
      password: selectedUser.password ? selectedUser.password : undefined, // Send password only if it's provided
    };

    axios
      .put(`/users/edit/${selectedUser.user_id}`, userDataToUpdate, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        alert("User updated successfully");
        closeEditModal();
        // Optionally refetch users list here if you want to reflect changes immediately
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Failed to update user");
      });
  };

  // const handleDelete = async (userId: number) => {
  //   try {
  //     await axios.put(`/users/delete/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Ensure you pass the token
  //       },
  //     });
  //     alert("User successfully deactivated.");
  //     closeDeleteModal(); // Close the confirmation modal after deactivation
  //     isUsersRefetch(); // Refetch users to update the table
  //   } catch (error) {
  //     console.error("Error deactivating user:", error);
  //     alert("Failed to deactivate the user. Please try again.");
  //   }
  // };

  const handleUpdateActivationStatus = (user_id: any, is_active: boolean) => {
    mutate({ user_id, is_active });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setSelectedRole(role);
  };

  return (
    <>
      <Header />
      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
          <div
            className="col-span-1 md:col-span-4 lg:col-span-3 detail-status"
            style={{ position: "relative" }}
          >
            <Navbar />
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-8 lg:col-span-9 pb-10 px-5 relative">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Manage Accounts</h1>
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                Add Accounts
              </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  {step === "select" ? (
                    <>
                      <h2 className="text-xl font-bold mb-4">
                        Select Account Type
                      </h2>
                      <div className="grid gap-4">
                        <button
                          onClick={() => handleUserTypeSelect("faculty")}
                          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                        >
                          Teacher
                        </button>

                        <button
                          onClick={() => handleUserTypeSelect("student")}
                          className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600"
                        >
                          Student
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold mb-4">
                        Register{" "}
                        {data.userType.charAt(0).toUpperCase() +
                          data.userType.slice(1)}{" "}
                        Account
                      </h2>

                      <form>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter first name"
                            value={data.firstName}
                            onChange={(e) =>
                              setData({ ...data, firstName: e.target.value })
                            }
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter last name"
                            value={data.lastName}
                            onChange={(e) =>
                              setData({ ...data, lastName: e.target.value })
                            }
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter email"
                            value={data.email}
                            onChange={(e) =>
                              setData({ ...data, email: e.target.value })
                            }
                          />
                        </div>
                        {data.userType === "student" && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ID Number
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                              placeholder="Enter ID number"
                              value={data.id_number || ""}
                              onChange={(e) =>
                                setData({ ...data, id_number: e.target.value })
                              }
                            />
                          </div>
                        )}
                        {/* 
                        {data.userType === 'faculty' && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={data.subjectId || ''}
                              onChange={(e) => setData({ ...data, subjectId: e.target.value })}
                            >
                              <option value="">Select a subject</option>
                              {subjects?.data.map((subject: any) => (
                                <option key={subject.subject_id} value={subject.subject_id}>
                                  {subject.subject_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )} */}

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 mr-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleRegisterTeacher}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                          >
                            Register
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Filter Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            {/* User Table */}
            <div className="listusers mt-5">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Full Name</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Role</th>
                    <th className="border px-4 py-2">Active</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map((user: any, index: number) => (
                    <tr key={user.user_id}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">{user.role_name}</td>
                      <td className="border px-4 py-2">
                        {user.is_active ? "Yes" : "No"}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2"
                        >
                          Edit
                        </button>
                        <button
                          disabled={isPending}
                          onClick={() => {
                            const status = user.is_active ? false : true;
                            handleUpdateActivationStatus(user.user_id, status);
                          }}
                          className={`px-4 py-2 text-white rounded-md ${
                            user.is_active ? "bg-red-500" : "bg-green-500"
                          }`}
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isEditModalOpen && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Edit User</h2>
                  <form>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={selectedUser.first_name}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            first_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={selectedUser.last_name}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="********"
                        value={selectedUser?.password || ""} // Bind it to selectedUser.password
                        onChange={
                          (e) =>
                            setSelectedUser({
                              ...selectedUser,
                              password: e.target.value,
                            }) // Update selectedUser password
                        }
                      />
                    </div>

                    {/* Add more fields if needed */}
                    {selectedUser.role_name === "faculty" && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <select
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={selectedUser.subject_id}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              subject_id: e.target.value,
                            })
                          }
                        >
                          <option value="">Select a subject</option>
                          {subjects?.data.map((subject: any) => (
                            <option
                              key={subject.subject_id}
                              value={subject.subject_id}
                            >
                              {subject.subject_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {selectedUser.role_name === "student" && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter ID number"
                          value={selectedUser.id_number || ""}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              id_number: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleEditSubmit}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* {isDeleteModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                  <p className="mb-6">
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeDeleteModal}
                      className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(userIdToDelete)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageAccount;
