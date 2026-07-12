import { NavLink } from "react-router-dom";
import { Bell, LayoutDashboard, Send, User } from "lucide-react";
import { useSelector } from "react-redux";

const MobileBottomNav = () => {
  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  const menuItems = [
    {
      path: "/student",
      icon: <LayoutDashboard size={22} />,
      label: "Dashboard",
    },
    {
      path: "/student/sent-invites",
      icon: <Send size={22} />,
      label: "Invites",
    },
    {
      path: "/student/notifications",
      icon: <Bell size={22} />,
      label: "Notifications",
    },
    {
      path: "/student/profile",
      icon: <User size={22} />,
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-around">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/student"}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center transition-all duration-200 ${
                isActive
                  ? "text-blue-500"
                  : "text-slate-400 hover:text-white"
              }`
            }
          >
            {item.icon}

            {item.label === "Notifications" &&
              notifications.length > 0 && (
                <span className="absolute -top-1 right-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {notifications.length > 99
                    ? "99+"
                    : notifications.length}
                </span>
              )}

            <span className="mt-1 text-[10px]">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;