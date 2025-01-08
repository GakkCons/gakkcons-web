// import { Navigate, Outlet } from 'react-router';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from '../plugins/axios';

// const useAuth = () => {
//   const queryClient = useQueryClient();
//   const authToken = queryClient.getQueryData(['authToken']);  

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['authProfile'],
//     queryFn: async () => {
//       if (!authToken) {
//         throw new Error('No token found');
//       }

//       const response = await axios.get('/users/profile', {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });
//       return response.data;
//     },
//     enabled: !!authToken,  
//   });

//   return { isAuthenticated: !!data, isLoading, error };
// };

// const ProtectedRoutes = () => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;  
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/" />;  
// };

// export default ProtectedRoutes;
import { Navigate, Outlet } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../plugins/axios';

const useAuth = () => {
    const queryClient = useQueryClient();
    
    // Check sessionStorage for token if not found in the query cache
    const authToken = queryClient.getQueryData(['authToken']) || sessionStorage.getItem('authToken');
    const userType = queryClient.getQueryData(['userType']) || sessionStorage.getItem('userType');
    
    const { data, isLoading, error } = useQuery({
      queryKey: ['authProfile'],
      queryFn: async () => {
        if (!authToken) {
          throw new Error('No token found');
        }
  
        const response = await axios.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        return response.data;
      },
      enabled: !!authToken, // Only run the query if we have the token
    });
    
    return {
      user: data,
      userType: data?.userType || userType,  // Fallback to userType from cache if not available in profile data
      isAuthenticated: !!data,
      isLoading,
      error,
    };
  };
  
  const ProtectedRoutes = ({ requiredRoles }: { requiredRoles?: string[] }) => {
    const { userType, isAuthenticated, isLoading } = useAuth();
  
    if (isLoading) {
      return <div>Loading...</div>;  
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/" />;  // Redirect to login if not authenticated
    }
  
    // Check if userType is one of the allowed roles
    if (requiredRoles && !requiredRoles.includes(userType)) {
      return <Navigate to="/home" />;  // Redirect if userType is not allowed
    }
  
    return <Outlet />;  // Allow access to the route
  };
  
  
export default ProtectedRoutes;
