
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import { useEffect, useState } from 'react'

function App() {

  const [auth, setAuth] = useState(
    localStorage.getItem('loggedUser') !== null
      ? JSON.parse(localStorage.getItem('loggedUser') || "")
      : null
  );
  
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedUser = localStorage.getItem('loggedUser');
      setAuth(loggedUser ? JSON.parse(loggedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const PrivateRoute = ()=>{
    return auth ? <Outlet /> : <Navigate to={"/login"} />
  }



  return (
    <>
        <Routes>
          <Route  element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          </Route>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </>
  )
}

export default App
