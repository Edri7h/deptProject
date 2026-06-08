import express from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';



import authRoutes from "./modules/auth/auth.route.js";
import teamRoutes from "./modules/teams/team.route.js";
import userRoutes from "./modules/user/user.route.js";
import mentorRoutes from "./modules/mentor/mentor.route.js";
import projectRouter from "./modules/projects/project.route.js"

const app= express();


app.use(cors({
  origin: "https://dept-project.vercel.app",
  credentials: true
}));
app.use(cookieParser());

app.get("/",(req,res)=>{
        return res.status(200).json({
            message: "server is running!!",
            status: "success"
        })
})

app.use(express.json())

app.use("/api/auth", authRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/users", userRoutes);
app.use("/api/projects",projectRouter)

app.use("/api/mentor", mentorRoutes);

export default app;