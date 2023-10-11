import "regenerator-runtime";
import "dotenv/config";
import "/kiosk-server/kiosk-server/db.js";
import app from "/kiosk-server/kiosk-server/server.js";

const port = process.env.port || 8000; // 서버 포트 번호

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${port} 🚀`);

app.listen(port, "0.0.0.0", handleListening);
