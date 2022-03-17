import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
const handelOpen = () => console.log("✅ Connected to DB 🚀");
const handelError = (error) => console.log("❌ DB Error", error);
db.on("error", handelError);
db.once("open", handelOpen)