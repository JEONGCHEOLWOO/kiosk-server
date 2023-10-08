const mongoose = require("mongoose"); // 몽구스 임포트 -> DB

mongoose
  .connect(
    // 몽구스 연결
    "mongodb+srv://tony.9m16o0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlPaser: true,
      useUnifiedTofology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB conected")) // 몽구스 연결 시 출력
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => console.log(`Connected to MongoDB`)); // 서버 연결 시 출력
