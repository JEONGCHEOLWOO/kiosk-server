const express = require("express"); // express 임포트

const port = 8000; // 서버 포트 번호
const app = express(); // app 생성 => 서버 생성

app.use(express.json());

app.get("/", function (req, res) {
  // res.send('Hello World')
  res.json({ msg: "Hello World" });
  // 서버에 접속요청이 오면 'Connected to server'를 출력
  console.log("Connected to server");
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server listenting on http://localhost:${port}`);
});
