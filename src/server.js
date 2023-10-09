// Router(라우터): 클라이언트 요청 경로(path)를 보고 이 요청을 처리할 수 잇는 곳으로 기능을 전달해주는 역할, 연결장치, 간략화 및 가독성을 위해 사용
// 임포트는 app.use()와 세트
// morgan(모건): logging(로깅)에 도움을 주는 미들웨어, 클라이언트와 서버의 응답 사이에 존재
// logging(로깅): 무슨일이 어디에서 일어났는지를 기록하는 것
// CORS(Cross-Origin Resource Sharing, 크록스): 자신이 속하지 않은 다른 도메인, 다른 프로토콜, 혹은 다른 포트에 있는 리소스를 요청하는 cross-origin HTTP 요청 방식

const express = require("express"); // express 임포트
const morgan = require("morgan"); // morgan(모건) 임포트
const moment = require("moment-timezone"); // moment-timezone 임포트
const cors = require("cors"); // cors 임포트
const userRouter = require("./routers/userRouter"); // userRouter 임포트
const menuRouter = require("./routers/menuRouter"); // menuRouter 임포트
const orderRouter = require("./routers/orderRouter"); // orderRouter 임포트
const payRouter = require("./routers/payRouter"); // payRouter 임포트

const app = express(); // app 생성 => 서버 생성

app.use(cors()); // 모든 도메인에서 제한 없이 해당 서버에 요청을 보내고 응답을 받을 수 있음

app.use(
  morgan((tokens, req, res) => {
    // 한국 시간을 기준으로 응답시간을 받음
    const koreaTime = moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
    return `${koreaTime} ${tokens.method(req, res)} ${tokens.url(
      req,
      res
    )} ${tokens.status(req, res)} ${tokens["response-time"](req, res)} ms`;
  })
);

app.use(express.json()); // 요청 body의 json 데이터를 파싱
app.use(express.urlencoded({ extended: true })); // 요청 body의 URL-encoded 데이터를 파싱

app.get("/", function (req, res) {
  // 서버에 출력
  res.send("Express 서버 작동 중");
  // 터미널 콘솔에 출력
  console.log("Connected to express server");
});

//-------------------------------
app.use("/pay", payRouter);
app.use("/user", userRouter);
app.use("/menu", menuRouter);
app.use("/order", orderRouter);

export default app;
