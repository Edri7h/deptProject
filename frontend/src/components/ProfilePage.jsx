import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { user, team } = useSelector((state) => state.auth);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-5">Profile</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <p><span className="text-slate-400">Name:</span> {user?.name}</p>
        <p><span className="text-slate-400">Email:</span> {user?.email}</p>
        <p><span className="text-slate-400">Department:</span> {user?.dept}</p>
        <p><span className="text-slate-400">Role:</span> {user?.role}</p>
        {user?.rollNo && <p><span className="text-slate-400">Roll No:</span> {user.rollNo}</p>}
        {team && <p><span className="text-slate-400">Team:</span> {team.teamName}</p>}
      </div>
    </div>
  );
}
