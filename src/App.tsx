// import { BrowserRouter, Routes, Route } from 'react-router'
// import Login from './pages/Authentication/Login'
// import ProtectedRoutes from './pages/utils/ProtectedRoutes'
// import ConsultationRequest from './pages/Home'
// import ConsultationQueue from './pages/Consultationqueue'
// import Profile from './pages/Profile'
// import Report from './pages/Report'

// function App() {
//   return (
//     <BrowserRouter>
//         <Routes>
//             <Route element={<Login />} path='/' />

//             // PROTECTED ROUTES
//             <Route element={<ProtectedRoutes/>}>
//               <Route element={<ConsultationRequest />} path='/home' />
//               <Route element={<ConsultationQueue />} path='/consultationqueue' />
//               <Route element={<Profile />} path='/profile' />
//               <Route element={<Report />} path='/report' />

      
//             </Route>

//         </Routes>
//     </BrowserRouter>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route } from 'react-router';
import Login from './pages/Authentication/Login';
import ProtectedRoutes from './pages/utils/ProtectedRoutes';
import ConsultationRequest from './pages/Home';
import ConsultationQueue from './pages/Consultationqueue';
import Profile from './pages/Profile';
import Report from './pages/Report';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route element={<Login />} path="/" />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes requiredRoles={['admin', 'faculty']} />}>
          <Route element={<ConsultationRequest />} path="/home" />
          <Route element={<ConsultationQueue />} path="/consultationqueue" />
          <Route element={<Profile />} path="/profile" />
        </Route>

        {/* Admin-only Route */}
        <Route element={<ProtectedRoutes requiredRoles={['admin']} />}>
          <Route path="/report" element={<Report />} /> {/* Admin-only route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


