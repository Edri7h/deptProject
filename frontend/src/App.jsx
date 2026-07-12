import ProfessorDashboard from "./components/ProfessorDashboard"
import StudentDashboard from "./components/StudentDashboard"
import NotificationsPage from "./components/NotificationsPage"
import ProfilePage from "./components/ProfilePage"
import SentInvitesPage from "./components/SentInvitesPage"
import ProfessorLayout from "./layout/ProfessorLayout"
import StudentLayout from "./layout/StudentLayout"
import Login from "./pages/Login"
import { Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import Unauthorized from "./pages/Unauthorized.jsx"
import NotFound from "./pages/NotFound"
import RoleProtectedRoute from "./components/RoleProtectedRoute"
import AlreadyLogged from "./components/AlreadyLogged"
import { useDispatch } from "react-redux"
import { meAPI } from "./services/auth.api"
import { logout, setLoading, setUserData } from "./redux/slices/authSlice"
import { useEffect } from "react"
import socket from "./socket/socket"
import { toast } from "sonner"
import { setNotifications, setNotificationsLoading } from "./redux/slices/notificationSlice"
import { getNotificationsAPI } from "./services/user.api"
import { registerSocketEvents, unregisterSocketEvents } from "./socket/socketEvents"
function App() {

  const dispatch = useDispatch();




  const loadNotifications = async () => {
    dispatch(setNotificationsLoading(true));
    try {
      const { data } = await getNotificationsAPI();

      dispatch(setNotifications(data.data));

    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not load notifications");
    } finally {
      dispatch(setNotificationsLoading(false));
    }
  };

  useEffect(() => {

    const checkAuth = async () => {

      try {
        dispatch(setLoading(true))
        // dashboard api -> gets basic data to check if user is logged in and also get the role of the user
        const { data } = await meAPI();
        console.log("meAPI data:", data);

        // set user data in redux store
        dispatch(setUserData(data.data))
        // get notification of the current user and set it in redux store
        loadNotifications();
       
        // socket.connect();
        // socket connection established and register the user id with the socket server
        //start
        socket.connect();
        
        

        socket.on("connect", () => {
          console.log("✅ Connected", socket.id);
          socket.emit("register", data.data?.user?.id)
        });
        // end

        // imp stuff
        // all the realtime listeners are added here, so that they are added only when the user is logged in and removed when the user logs out

        registerSocketEvents(dispatch);


        // socket.on("teamInviteReceived", (notification) => {

        //   toast.success(notification.message)
        //   dispatch(addNotification(notification))

        //   console.log("invite recived through sockets", notification);
        //   // console.log(notification);

        // });

        socket.on("connect_error", (err) => {
          console.log("❌ Connect Error:", err.message);
        });

      } catch (error) {
        console.log(error)

        dispatch(logout());

      } finally {
        dispatch(setLoading(false));
      }

    };

    checkAuth();
    
    // cleanup function to remove all the socket listeners and disconnect the socket when the component unmounts or when the user logs out
    return () => {
      
      
      unregisterSocketEvents();
      socket.disconnect();
    };




  }, []);




  return (
    <>

      {/* <Login/> */}
      <Toaster />
      <Routes>
        <Route path="/" element={<AlreadyLogged> <Login /> </AlreadyLogged>} />

        <Route path="/student" element={<RoleProtectedRoute allowedRole={"student"} ><StudentLayout /></RoleProtectedRoute>}>

          <Route index element={<StudentDashboard />}></Route>
          <Route path="sent-invites" element={<SentInvitesPage />}></Route>
          <Route path="notifications" element={<NotificationsPage />}></Route>
          <Route path="profile" element={<ProfilePage />}></Route>



        </Route>

        <Route path="/professor" element={<RoleProtectedRoute allowedRole={"professor"} ><ProfessorLayout /></RoleProtectedRoute>}>
          <Route index element={<ProfessorDashboard />}></Route>
        </Route>



        <Route path="/unauthorized" element={<Unauthorized />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
export default App