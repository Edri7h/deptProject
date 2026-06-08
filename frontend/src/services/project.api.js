import api from "./api";


export const  fetchProjectAPI=()=>{
    return api.get("/projects/get")
}

