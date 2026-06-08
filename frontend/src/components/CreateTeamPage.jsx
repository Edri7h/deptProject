import { useEffect, useState } from "react";
import { fetchProjectAPI } from "../services/project.api.js";
// import { createTeamAPI } from "@/services/team.api";
import { useNavigate } from "react-router-dom";


export default function CreateTeamPage() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [creatingTeam, setCreatingTeam] = useState(false);

    const [teamName, setTeamName] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoadingProjects(true);

                const { data } = await fetchProjectAPI();
                
                console.log(data.data);
                setProjects(data.data || []);
            } catch (error) {
                console.log(error);
                alert("Failed to fetch projects");
            } finally {
                setLoadingProjects(false);
            }
        };




        fetchProjects();
    }, []);



    const handleCreateTeam = async () => {
        try {
            if (!teamName.trim()) {
                return alert("Please enter team name");
            }

            if (!selectedProjectId) {
                return alert("Please select a project");
            }

            setCreatingTeam(true);

            await createTeamAPI({
                teamName,
                projectId: selectedProjectId,
            });

            alert("Team created successfully");

            navigate("/student/dashboard");
        } catch (error) {
            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Failed to create team"
            );
        } finally {
            setCreatingTeam(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow p-6">
                <h1 className="text-3xl font-bold mb-2">
                    Create Team
                </h1>

                <p className="text-gray-500 mb-6">
                    Choose a project and create your team.
                </p>

                {/* Team Name */}
                <div className="mb-8">
                    <label className="block font-medium mb-2">
                        Team Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter team name"
                        value={teamName}
                        onChange={(e) =>
                            setTeamName(e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Projects */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Select Project
                    </h2>

                    {loadingProjects ? (
                        <p>Loading projects...</p>
                    ) : projects.length === 0 ? (
                        <div className="border rounded-xl p-6 text-center">
                            No projects available
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => {
                                const isSelected =
                                    selectedProjectId === project.id;

                                return (
                                    <div
                                        key={project.id}
                                        onClick={() =>
                                            setSelectedProjectId(project.id)
                                        }
                                        className={`
                      cursor-pointer
                      border
                      rounded-2xl
                      p-5
                      transition-all
                      ${isSelected
                                                ? "border-blue-600 bg-blue-50"
                                                : "hover:border-gray-400"
                                            }
                    `}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-lg">
                                                {project.title}
                                            </h3>

                                            {isSelected && (
                                                <span className="text-blue-600 font-bold">
                                                    ✓
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mt-3 text-sm">
                                            {project.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleCreateTeam}
                        disabled={
                            creatingTeam ||
                            !teamName.trim() ||
                            !selectedProjectId
                        }
                        className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              text-white
              hover:bg-blue-700
              disabled:bg-gray-400
              disabled:cursor-not-allowed
            "
                    >
                        {creatingTeam
                            ? "Creating..."
                            : "Create Team"}
                    </button>
                </div>
            </div>
        </div>
    );
}