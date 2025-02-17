import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Authentication/Login";
import ProtectedRoutes from "./pages/utils/ProtectedRoutes";
import ConsultationRequest from "./pages/Home";
import ConsultationQueue from "./pages/Consultationqueue";
import Profile from "./pages/Profile";
import Report from "./pages/Report";
import ManageAccount from "./pages/ManageAccount";
import SocketContextProvider from "./pages/contexts/SocketContext";
import Consultationrecord from "./pages/Consultationrecord";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        <Route
          element={<ProtectedRoutes requiredRoles={["admin", "faculty"]} />}
        >
          <Route
            path="/profile"
            element={
              <SocketContextProvider>
                <Profile />{" "}
              </SocketContextProvider>
            }
          />
        </Route>

        <Route element={<ProtectedRoutes requiredRoles={["faculty"]} />}>
          <Route
            path="/home"
            element={
              <SocketContextProvider>
                <ConsultationRequest />
              </SocketContextProvider>
            }
          />
          <Route
            path="/consultationqueue"
            element={
              <SocketContextProvider>
                <ConsultationQueue />
              </SocketContextProvider>
            }
          />

          <Route
            path="/record"
            element={
              <SocketContextProvider>
                <Consultationrecord />
              </SocketContextProvider>
            }
          />          
        </Route>

        <Route element={<ProtectedRoutes requiredRoles={["admin"]} />}>
          <Route
            path="/accounts"
            element={
              <SocketContextProvider>
                <ManageAccount />
              </SocketContextProvider>
            }
          />
          <Route
            path="/report"
            element={
              <SocketContextProvider>
                <Report />
              </SocketContextProvider>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
