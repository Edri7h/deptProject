import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearNotifications } from "@/redux/slices/notificationSlice";
import { logoutAPI } from "@/services/auth.api";
import socket from "@/socket/socket";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const TopHeader = () => {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } finally {
      socket.disconnect();
      dispatch(clearNotifications());
      dispatch(logout());
      toast.success("Logged out");
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="h-full px-5 md:px-8 flex items-center justify-between">

        <div>
          <h1 className="text-xl font-bold">ProjectHub</h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Student Portal
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="hidden sm:block text-right">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-slate-400">
              {user?.email}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="md:hidden p-2 rounded-lg hover:bg-red-500/10 text-red-400"
          >
            <LogOut size={20} />
          </button>

        </div>
      </div>
    </header>
  );
};

export default TopHeader;