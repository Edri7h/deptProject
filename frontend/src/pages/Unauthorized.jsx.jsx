// Unauthorized.jsx


export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>

        <h2 className="text-2xl font-semibold mt-4">
          Access Denied
        </h2>

        <p className="text-slate-400 mt-2">
          You don't have permission to access this page.
        </p>

       
      </div>
    </div>
  );
}