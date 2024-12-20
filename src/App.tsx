import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './pages/Authentication/Login'
import ProtectedRoutes from './pages/utils/ProtectedRoutes'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<Login />} path='/' />
            <Route element={<Home />} path='/home' />

            // PROTECTED ROUTES
            <Route element={<ProtectedRoutes/>}>
                
            
            </Route>

        </Routes>
    </BrowserRouter>
  )
}

export default App