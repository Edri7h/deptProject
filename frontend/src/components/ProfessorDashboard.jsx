import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getProfessorDashboardAPI } from "@/services/auth.api";
import { acceptMentorRequestAPI, rejectMentorRequestAPI } from "@/services/mentor.api";
import { setUserData } from "@/redux/slices/authSlice";

export default function ProfessorDashboard() {
  const dispatch = useDispatch();
  const { user, pendingRequests, mentoredTeams, stats } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const { data } = await getProfessorDashboardAPI();
      dispatch(setUserData(data.data));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDecision = async (request, action) => {
    try {
      if (action === "accept") {
        await acceptMentorRequestAPI(request.id, request.notificationId);
        toast.success("Mentor request accepted");
      } else {
        await rejectMentorRequestAPI(request.id, request.notificationId);
        toast.success("Mentor request rejected");
      }

      await loadDashboard();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update request");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-slate-400 mt-2">Department: {user?.dept}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">Pending Requests</h3>
          <p className="text-3xl font-bold mt-2">{stats?.pendingRequests || 0}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">Active Students</h3>
          <p className="text-3xl font-bold mt-2">{stats?.activeStudents || 0}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-slate-400">Mentored Teams</h3>
          <p className="text-3xl font-bold mt-2">{stats?.supervisedProjects || 0}/3</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <h2 className="text-xl font-semibold mb-4">Pending Mentor Requests</h2>

        {loading && <p className="text-slate-400">Loading requests...</p>}

        {!loading && pendingRequests.length === 0 && (
          <p className="text-slate-400">No pending mentor requests.</p>
        )}

        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div key={request.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{request.team?.teamName}</h3>
                  <p className="text-sm text-slate-400">
                    Leader: {request.team?.leader?.name} | Project: {request.team?.project?.title}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Members: {request.team?.members?.length || 0}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleDecision(request, "accept")} className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700">
                    Accept
                  </button>
                  <button onClick={() => handleDecision(request, "reject")} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <h2 className="text-xl font-semibold mb-4">My Mentored Teams</h2>

        {!loading && mentoredTeams.length === 0 && (
          <p className="text-slate-400">You are not mentoring any teams yet.</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {mentoredTeams.map((team) => (
            <div key={team.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <h3 className="font-semibold text-lg">{team.teamName}</h3>
              <p className="text-sm text-slate-400 mt-1">
                Project: {team.project?.title || "N/A"}
              </p>
              <p className="text-sm text-slate-400">
                Leader: {team.leader?.name || "N/A"}
              </p>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-300">Members</p>
                <div className="mt-2 space-y-2">
                  {team.members?.map((member) => (
                    <div key={member.user?.id || member.id} className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2">
                      <p className="text-sm">{member.user?.name}</p>
                      <p className="text-xs text-slate-500">{member.user?.rollNo || member.user?.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
