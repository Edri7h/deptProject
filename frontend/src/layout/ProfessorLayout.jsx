import { LayoutDashboard, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout, setUserData } from "@/redux/slices/authSlice";
import { logoutAPI, meAPI } from "@/services/auth.api";

const ProfessorLayout=React.memo(()=>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await meAPI();
        if (data.data.user.role !== "professor") {
          navigate("/student", { replace: true });
          return;
        }
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

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white grid place-items-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-400">ProjectHub</h1>
          <p className="text-sm text-slate-400 mt-1">Professor Portal</p>
        </div>

        <nav className="flex-1 p-4">
          <NavLink
            end
            to="/professor"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
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
})

export default  ProfessorLayout
