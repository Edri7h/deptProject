import api from "./api"

export  function createTeamAPI(payload){
      return   api.post("/teams/create",payload)
}


export const searchStudent=(info)=>{
      return api.get(`/teams/search-student?info=${encodeURIComponent(info)}`)
}

export const sendInviteAPI=(receiverId,teamId)=>{
      return api.post(`/teams/${teamId}/invite`,{
            receiverId
      })
}

export const getSentInvitesAPI=()=>{
      return api.get("/teams/sent-invites")
}

export const cancelInviteAPI=(requestId)=>{
      return api.delete(`/teams/invite/${requestId}`)
}
