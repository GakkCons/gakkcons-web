import { Outlet, Navigate } from "react-router";


const ProtectedRoutes = () => {
    const user = null

    return user ? < Outlet /> : <Navigate to='/login' />

}

export default ProtectedRoutes