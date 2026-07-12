import axios from  "axios"


const api = axios.create({
    baseURL:`${import.meta.env.VITE_API_URL}/api`,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json", 
    },
    timeout:100000,

})


export default api;