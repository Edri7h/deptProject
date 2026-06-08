import api from "./api";

export const loginAPI=(data)=>{
    return api.post("/auth/login",data)
}

export const logoutAPI=()=>{
    return api.post("/auth/logout");
}

export const meAPI=()=>{
    return api.get("/auth/me");
}

export const getDashboardAPI=()=>{
    return api.get("/auth/student/dashboard");
}

export const getProfessorDashboardAPI=()=>{
    return api.get("/auth/professor/dashboard");
}
