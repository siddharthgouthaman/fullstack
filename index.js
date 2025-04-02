// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import db from "./utils/db.js"
// import cookieParser from "cookie-parser"
// //import all routes 
// import userRoutes from "./routes/user.routes.js"
// dotenv.config()
// const app = express()
// const port = process.env.PORT || 4000 //5000 //5173 //8080 /(80/23)
// app.use(cors({
//   orgin:process.env.BASE_URL,
//   credentials:true,
//   methods:['GET','POST','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization']
// }));
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());
// app.get("/", (req , res) => {// get ,post ,put delete
//   res.send('Cohort!')
// });
// app.get("/sid",(req,res)=>{
// res.send("sid")
// });
// console.log(process.env.PORT);
// //connect db
// db()
// //user routes 
// app.use("/api/v1/users/",userRoutes)
// app.listen(port, () => {
//   console.log('Example app listening on port ${port}')
// });
import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://127.0.0.1:5500", // Change this to your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

db();

// API Routes
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});