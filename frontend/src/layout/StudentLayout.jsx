import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, LayoutDashboard, LogOut, Send, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout, setUserData } from "@/redux/slices/authSlice";
import { getDashboardAPI, logoutAPI } from "@/services/auth.api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const StudentLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await getDashboardAPI();
        dispatch(setUserData(data.data));
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } finally {
      dispatch(logout());
      toast.success("Logged out");
      navigate("/", { replace: true });
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/student", icon: <LayoutDashboard size={20} /> },
    { name: "Sent Invites", path: "/student/sent-invites", icon: <Send size={20} /> },
    { name: "Notifications", path: "/student/notifications", icon: <Bell size={20} /> },
    { name: "Profile", path: "/student/profile", icon: <User size={20} /> },
  ];

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white grid place-items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-400">ProjectHub</h1>
          <p className="text-sm text-slate-400 mt-1">Student Portal</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  end={item.path === "/student"}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
