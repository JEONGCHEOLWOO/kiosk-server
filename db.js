const mongoose = require("mongoose"); // 몽구스 임포트 -> DB

// MongoDB 연결 정보 설정
const dbURL =
  process.env.DB_URL ||
  "mongodb://svc.sel5.cloudtype.app:32110/your-database-name";

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
