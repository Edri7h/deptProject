import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AddTeamMembers from "./AddTeamMembers";
import { setTeamData } from "@/redux/slices/authSlice";
import { fetchProjectAPI } from "@/services/project.api";
import { createTeamAPI } from "@/services/team.api";
import { searchProfessorAPI, sendMentorRequestAPI } from "@/services/mentor.api";
import { getDashboardAPI } from "@/services/auth.api";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const { user, isMember, memberDetails, team } = useSelector((state) => state.auth);
  const [teamName, setTeamName] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [professorSearch, setProfessorSearch] = useState("");
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await fetchProjectAPI();
      setProjects(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProjects = async () => {
    setOpenSheet(true);

    if (projects.length === 0) {
      await fetchProjects();
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return toast.error("Enter a team name");
    if (!selectedProject) return toast.error("Select a project");

    try {
      const { data } = await createTeamAPI({
        teamName,
        projectId: selectedProject.id,
      });
      const dashboardResponse = await getDashboardAPI();
      dispatch(setTeamData({ ...data.data, project: selectedProject, leader: user, members: [{ user }] }));
      dispatch({ type: "auth/setUserData", payload: dashboardResponse.data.data });
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not create team");
    }
  };

  const handleSearchProfessor = async () => {
    if (!professorSearch.trim()) return;

    try {
      const { data } = await searchProfessorAPI(professorSearch);
      setProfessors(data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not search professors");
    }
  };

  const handleMentorRequest = async (professorId) => {
    try {
      const { data } = await sendMentorRequestAPI(team.id, professorId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not send mentor request");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-slate-400 mt-2">Department: {user?.dept}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400">Team</p>
          <p className="text-2xl font-bold mt-2">{isMember ? "Created" : "Pending"}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400">Members</p>
          <p className="text-2xl font-bold mt-2">{memberDetails?.length || 0}/4</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-400">Mentor</p>
          <p className="text-2xl font-bold mt-2">{team?.mentor?.name || "Pending"}</p>
        </div>
      </div>

      {!isMember && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="text-xl font-semibold">Create Your Team</h2>
            <p className="text-slate-400 mt-2">Choose a project and create your team to begin.</p>
          </div>

          <input
            className="border-2 border-slate-700 rounded-md text-white bg-transparent p-3 w-full max-w-md"
            placeholder="Team name"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
          />

          <div className="flex gap-3">
            <button onClick={handleOpenProjects} className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700">
              {selectedProject ? "Change Project" : "Select Project"}
            </button>
            <button onClick={handleCreateTeam} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700">
              Create Team
            </button>
          </div>

          {selectedProject && (
            <div className="rounded-xl border border-blue-800 bg-blue-950/30 p-4">
              <p className="text-sm font-semibold text-blue-300">Selected Project</p>
              <h3 className="mt-2 font-semibold">{selectedProject.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{selectedProject.category}</p>
              <p className="text-sm text-slate-500 mt-2">{selectedProject.description}</p>
            </div>
          )}

          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetContent className="bg-slate-950 border-slate-800 text-white sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-white">Select Project</SheetTitle>
              </SheetHeader>

              <ScrollArea className="h-[85vh] px-4 pb-4">
                <div className="space-y-3">
                  {loading && <p className="text-slate-400">Loading projects...</p>}

                  {!loading &&
                    projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          setOpenSheet(false);
                        }}
                        className={`w-full text-left rounded-xl border p-4 transition ${
                          selectedProject?.id === project.id
                            ? "border-blue-500 bg-blue-950/40"
                            : "border-slate-700 bg-slate-900 hover:border-blue-500"
                        }`}
                      >
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{project.category}</p>
                        <p className="text-sm text-slate-500 mt-2">{project.description}</p>
                      </button>
                    ))}

                  {!loading && projects.length === 0 && (
                    <p className="text-slate-400">No projects found</p>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {isMember && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Team Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <p><span className="text-slate-400">Team:</span> {team?.teamName}</p>
              <p><span className="text-slate-400">Leader:</span> {team?.leader?.name || user?.name}</p>
              <p><span className="text-slate-400">Project:</span> {team?.project?.title || "N/A"}</p>
              <p><span className="text-slate-400">Mentor:</span> {team?.mentor?.name || "Not assigned"}</p>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold mb-2">Members</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {memberDetails?.map((member) => (
                  <div key={member.user?.id || member.id} className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                    {member.user?.name || member.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {user.id===team.leaderId &&  <AddTeamMembers />}

          {user?.id === team?.leaderId && !team?.mentorId && !team?.mentor && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Request a Mentor</h2>
              <div className="flex gap-3 mt-4">
                <input
                  value={professorSearch}
                  onChange={(event) => setProfessorSearch(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSearchProfessor()}
                  className="flex-1 border-2 border-slate-700 rounded-md text-white bg-transparent p-3"
                  placeholder="Professor name or email"
                />
                <button onClick={handleSearchProfessor} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700">
                  Search
                </button>
              </div>

              <div className="space-y-3 mt-4">
                {professors.map((professor) => (
                  <div key={professor.id} className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-4">
                    <div>
                      <p className="font-semibold">{professor.name}</p>
                      <p className="text-sm text-slate-400">{professor.email}</p>
                    </div>
                    <button onClick={() => handleMentorRequest(professor.id)} className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700">
                      Request
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
           
