import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import platformProfileRouter from "./routes/platformProfile.routes.js"
import platformStatsRouter from "./routes/platformStats.routes.js";
import errorHandler from "./middlewares/error.middleware.js"

const app= express()


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/users",userRouter)
app.use("/api/v1/profiles",platformProfileRouter)
app.use("/api/v1/stats",platformStatsRouter)

app.use(errorHandler);

export default app;