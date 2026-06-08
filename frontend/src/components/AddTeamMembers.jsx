import { useState } from "react";
import { searchStudent, sendInviteAPI } from "@/services/team.api";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const AddTeamMembers = () => {
  const [teamMemberDetail, setTeamMemberDetail] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const {team}=useSelector((state)=>state.auth);
    // console.log(team)
  const handleSearchMember = async () => {
    if (!teamMemberDetail.trim()) return;

    try {
      setLoading(true);

      const { data } = await searchStudent(teamMemberDetail);

      setStudents(data.data || []);
      console.log(data.data)
      setSearched(true);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Could not search students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite= async(studentId,teamId)=>{
     try {
        // console.log(studentId,teamId)
       const data= await sendInviteAPI(studentId,teamId)
       console.log(data.data)
        toast.success(data.data.message);
     } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Could not send invite")
     }
  }

  return (
    <div className="bg-blue-950 text-white rounded-xl p-6 shadow-lg border border-blue-800">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Add Members to Your Team
        </h2>

        <p className="text-gray-400 mt-1">
          Search students By Roll Number.
        </p>
      </div>

      {/* Search Box */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email, enrollment..."
          value={teamMemberDetail}
          onChange={(e) => setTeamMemberDetail(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSearchMember()
          }
          className="flex-1 px-4 py-3 rounded-lg bg-blue-900/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSearchMember}
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      <div className="mt-6">
        {loading && (
          <div className="text-center py-8 text-gray-400">
            Searching students...
          </div>
        )}

        {!loading &&
          searched &&
          students.length === 0 && (
            <div className="text-center py-8 bg-blue-900/20 rounded-lg border border-blue-800">
              <p className="text-gray-400">
                No students found.
              </p>
            </div>
          )}

        {!loading && students.length > 0 && (
          <>
            <h3 className="font-semibold text-lg mb-3">
              Search Results ({students.length})
            </h3>

            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h4 className="font-semibold text-lg">
                      {student.name}
                    </h4>

                    <p className="text-gray-400 text-sm">
                      {student.email}
                    </p>

                    {student.rollNo && (
                      <p className="text-gray-500 text-xs mt-1">
                        Roll Number: {student.rollNo}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={()=>handleInvite(student.id,team.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                  >
                    Invite
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddTeamMembers;
