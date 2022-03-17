// .env 환경변수 파일 변수 값을 불러옵니다.
import 'dotenv/config';
import "./db.js";
import "./models/Video.js";
import "./models/User.js";
import app from "./server.js"

const PORT = 4000;

const handleListening = () => console.log(`✅ Server listening on Port http://localhost:${PORT} 🚀`);
app.listen(PORT, handleListening);