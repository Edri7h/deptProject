import { useSelector } from "react-redux";

const TopHeader = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="h-full flex items-center justify-between px-5 md:px-8">

        {/* Left */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            ProjectHub
          </h1>

          <p className="text-xs text-slate-400 hidden sm:block">
            Student Portal
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-semibold text-white">
              {user?.name}
            </p>

            <p className="text-xs text-slate-400">
              {user?.email}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/30">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

        </div>
      </div>
    </header>
  );
};

export default TopHeader;