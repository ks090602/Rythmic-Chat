const express = require("express");
const dotenv = require("dotenv");
const {chats} = require("./data/data.js");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js")
const chatRoutes = require("./routes/chatRoutes.js")
const {notFound,errorHandler} = require("./middlewares/errorMiddleware.js")

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.get("/",(req,resp)=>{
    resp.send("API is Running");
});

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT,console.log(`The Server Started on Port ${PORT}`));



