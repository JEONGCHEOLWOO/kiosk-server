import "regenerator-runtime";
import "dotenv/config";
import "./db.js";
import app from "./server.js";

const port = process.env.port || 8000; // 서버 포트 번호

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${port} 🚀`);

app.listen(port, "0.0.0.0", handleListening);
