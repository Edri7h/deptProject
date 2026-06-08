import ProfessorDashboard from "./components/ProfessorDashboard"
import StudentDashboard from "./components/StudentDashboard"
import NotificationsPage from "./components/NotificationsPage"
import ProfilePage from "./components/ProfilePage"
import SentInvitesPage from "./components/SentInvitesPage"
import ProfessorLayout from "./layout/ProfessorLayout"
import StudentLayout from "./layout/StudentLayout"
import Login from "./pages/Login"
import { Route,Routes } from "react-router-dom"
import { Toaster } from "sonner"
import Unauthorized from "./pages/Unauthorized.jsx"
import NotFound from "./pages/NotFound"
import RoleProtectedRoute from "./components/RoleProtectedRoute"
import AlreadyLogged from "./components/AlreadyLogged"
import { useDispatch } from "react-redux"
import { meAPI } from "./services/auth.api"
import { logout, setLoading, setUserData } from "./redux/slices/authSlice"
import { useEffect } from "react"

function App() {

  const dispatch=useDispatch();

  useEffect(() => {

    const checkAuth = async () => {

      try {
        dispatch(setLoading(true))
        const { data } = await meAPI();

        console.log(data);
        dispatch(setUserData(data.data))

      } catch (error) {
          console.log(error)
          
       dispatch(logout());

      }finally{
        dispatch(setLoading(false));
      }

    };

    checkAuth();

  }, []);
  

  return (
    <>
   
      {/* <Login/> */}
       <Toaster/>
      <Routes>
      <Route path="/" element={ <AlreadyLogged> <Login /> </AlreadyLogged>} />

      <Route path="/student" element={  <RoleProtectedRoute allowedRole={"student"} ><StudentLayout /></RoleProtectedRoute>}>
      
        <Route index element={<StudentDashboard/>}></Route>
        <Route path="sent-invites" element={<SentInvitesPage/>}></Route>
        <Route path="notifications" element={<NotificationsPage/>}></Route>
        <Route path="profile" element={<ProfilePage/>}></Route>
      
      
      
      </Route>

      <Route path="/professor"element={ <RoleProtectedRoute allowedRole={"professor"} ><ProfessorLayout /></RoleProtectedRoute>}>
            <Route index element={<ProfessorDashboard/>}></Route>
      </Route>



      <Route path="/unauthorized" element={<Unauthorized/>}></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}
export default App