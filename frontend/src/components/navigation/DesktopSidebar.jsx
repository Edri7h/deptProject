import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Send,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAPI } from "@/services/auth.api";
import { logout } from "@/redux/slices/authSlice";
import { clearNotifications } from "@/redux/slices/notificationSlice";
import socket from "@/socket/socket";
import { toast } from "sonner";

const DesktopSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  const menuItems = [
    {
      name: "Dashboard",
      path: "/student",
      icon: <LayoutDashboard size={22} />,
    },
    {
      name: "Sent Invites",
      path: "/student/sent-invites",
      icon: <Send size={22} />,
    },
    {
      name: "Notifications",
      path: "/student/notifications",
      icon: <Bell size={22} />,
    },
    {
      name: "Profile",
      path: "/student/profile",
      icon: <User size={22} />,
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } finally {
      socket.disconnect();

      dispatch(clearNotifications());
      dispatch(logout());

      toast.success("Logged out");

      navigate("/", {
        replace: true,
      });
    }
  };

  return (
    <aside className="hidden md:flex w-20 bg-slate-900 border-r border-slate-800 flex-col items-center py-6">

      <div className="mb-10">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/30">
          PH
        </div>
      </div>

      <nav className="flex flex-col gap-4 flex-1">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/student"}
            title={item.name}
            className={({ isActive }) =>
              `relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
              
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white hover:scale-105"
              }
              
              `
            }
          >
            {item.icon}

            {item.name === "Notifications" &&
              notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-red-500 text-[10px] font-semibold flex items-center justify-center px-1 text-white">
                  {notifications.length > 99
                    ? "99+"
                    : notifications.length}
                </span>
              )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        title="Logout"
        className="w-12 h-12 rounded-xl text-red-400 hover:bg-red-500/10 hover:scale-105 transition-all flex items-center justify-center"
      >
        <LogOut size={22} />
      </button>
    </aside>
  );
};

export default DesktopSidebar;