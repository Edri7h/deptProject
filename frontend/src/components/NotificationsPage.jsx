
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getDashboardAPI } from "@/services/auth.api";
import { acceptInviteAPI,  rejectInviteAPI } from "@/services/user.api";
import { setUserData } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";
// import { setNotifications } from "@/redux/slices/notificationSlice";
import {removeNotification} from "@/redux/slices/notificationSlice"

export default function NotificationsPage() {
  const dispatch = useDispatch();

  let fetchedNotifications = useSelector(
  (state) => state.notification.notifications
);
const loading = useSelector((state) => state.notification.isLoading);
const alreadyInTeam=useSelector(state=>state.auth.isMember)






  const handleInvite = async (item, action) => {
    try {
      if (action === "accept") {
        await acceptInviteAPI(item.requestId, item.id);
        toast.success("Invite accepted");
      } else {
        await rejectInviteAPI(item.requestId, item.id);
        toast.success("Invite rejected");
      }
      // setFetchedNotifications((items) => items.filter((notification) => notification.id !== item.id));
      const { data } = await getDashboardAPI();
      dispatch(setUserData(data.data));
      dispatch(removeNotification(item.id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update invite");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-5">Notifications</h1>
      {loading && <p className="text-slate-400">Loading...</p>}
      {!loading && fetchedNotifications.length === 0 && <p className="text-slate-400">No unread notifications.</p>}

      <div className="space-y-3">
        {fetchedNotifications.map((item) => (
          <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-semibold">{item.message}</p>
                <p className="text-sm text-slate-400 mt-1">
                  From {item.sender?.name || "System"}
                  {item.request?.team?.teamName ? ` · ${item.request.team.teamName}` : ""}
                </p>
              </div>

              {item.notificationType === "TEAM_INVITE" && (
                <div className="flex gap-2">
                  {
                   !alreadyInTeam ? (<>
                    <button onClick={() => handleInvite(item, "accept")} className={`px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 ${alreadyInTeam?"opacity-50 cursor-not-allowed":""}`} disabled={alreadyInTeam}>
                      Accept
                    </button>
                   
                   
                   <button onClick={() => handleInvite(item, "reject")} className={`px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 ${alreadyInTeam?"opacity-50 cursor-not-allowed":""}`}>
                    Reject
                  </button> 
                    </>
                  ) :
                
                  (
                    alreadyInTeam && (
                      <button className="px-4 py-2 bg-gray-600 rounded-lg cursor-not-allowed opacity-50" disabled>
                        Already in a team
                      </button>
                    )

                  ) 


                   
                  }
                  
                  
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
