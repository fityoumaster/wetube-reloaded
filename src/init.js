import "./db.js";
import "./models/Video.js";
import app from "./server.js"

const PORT = 4000;

const handleListening = () => console.log(`✅ Server listening on Port http://localhost:${PORT} 🚀`);
app.listen(PORT, handleListening);