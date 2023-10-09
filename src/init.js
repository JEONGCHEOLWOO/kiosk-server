const dotenv = require("dotenv/config");
const db = require("./db");
const server = require("./server");

const port = process.env.port || 8000; // 서버 포트 번호

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${port} 🚀`);

app.listen(port, "0.0.0.0", handleListening);
