import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cancelInviteAPI, getSentInvitesAPI } from "@/services/team.api";
import { cancelMentorRequestAPI, getSentMentorRequestsAPI } from "@/services/mentor.api";

export default function SentInvitesPage() {
  const [teamInvites, setTeamInvites] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [teamResult, mentorResult] = await Promise.allSettled([
        getSentInvitesAPI(),
        getSentMentorRequestsAPI(),
      ]);

      if (teamResult.status === "fulfilled") setTeamInvites(teamResult.value.data.data || []);
      if (mentorResult.status === "fulfilled") setMentorRequests(mentorResult.value.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (requestId) => {
    try {
      await cancelInviteAPI(requestId);
      setTeamInvites((items) => items.filter((item) => item.id !== requestId));
      toast.success("Invite cancelled");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not cancel invite");
    }
  };

  const handleCancelMentorRequest = async (requestId) => {
    try {
      await cancelMentorRequestAPI(requestId);
      setMentorRequests((items) => items.filter((item) => item.id !== requestId));
      toast.success("Mentor request cancelled");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not cancel mentor request");
    }
  };

  const statusClass = (status) => status === "pending" ? "text-red-500" : "text-green-500";

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-5">Sent Team Invites</h1>
        {loading && <p className="text-slate-400">Loading...</p>}
        {!loading && teamInvites.length === 0 && <p className="text-slate-400">No sent team invites.</p>}

        <div className="space-y-3">
          {teamInvites.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div>
                <p className="font-semibold">{invite.receiver?.name}</p>
                <p className="text-sm text-slate-400">
                  {invite.receiver?.email} | <span className={statusClass(invite.status)}>{invite.status}</span>
                </p>
              </div>
              {invite.status === "pending" && (
                <button onClick={() => handleCancel(invite.id)} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-5">Sent Mentor Requests</h2>
        {mentorRequests.length === 0 && <p className="text-slate-400">No mentor requests sent.</p>}
        <div className="space-y-3">
          {mentorRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div>
                <p className="font-semibold">{request.receiver?.name}</p>
                <p className="text-sm text-slate-400">
                  {request.receiver?.email} | <span className={statusClass(request.status)}>{request.status}</span>
                </p>
              </div>
              {request.status === "pending" && (
                <button onClick={() => handleCancelMentorRequest(request.id)} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
