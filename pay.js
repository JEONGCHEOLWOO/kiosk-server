const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const ADMIN_KEY = "dd2abe88f31178ca95d65370aebd6205";
// const JS_KEY = "a90bdbcafa0d2640b4cf25be50f9f32f";

// 결제 준비
app.post("/prepare", async (req, res) => {
  try {
    const productName = "상품명";
    const productPrice = 1000000;

    const response = await axios.post(
      "https://kapi.kakao.com/v1/payment/ready",
      {
        cid: "TC0ONETIME", // 가맹점 코드
        partner_order_id: "order_id_123", // 가맹점 주문번호
        partner_user_id: "user_id_123", // 가맹점 회원 ID
        item_name: productName, // 상품
        quantity: 1, // 수량
        total_amount: productPrice, // 상품 총액
        tax_free_amount: 0, // 비과세 금액
        approval_url: "http://localhost:3000/success", // 결제 성공시 리다이렉트 URL
        cancel_url: "http://localhost:3000/cancel", // 결제 취소시 리다이렉트 URL
        fail_url: "http://localhost:3000/fail", // 결제 실패시 리다이렉트 URL
      },
      {
        headers: {
          Authorization: `KakaoAK ${ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    res.json(response.data);
    console.log("next_redirect_pc_url:", response.data.next_redirect_pc_url);
    const url = response.data.next_redirect_pc_url;
    const tid = response.data.tid;
    return url, tid;
    // http://localhost:3000/success?pg_token=0a3ad8ac4b3e07969fcf // 결제 완료시 url
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "결제 준비 실패" });
  }
});

// 결제 승인
app.post("/approve", async (req, res) => {
  try {
    const tid = tid;
    const pg_token = pg_token;
    const total_amount = total_amount;

    const response = await axios.post(
      "https://kapi.kakao.com/v1/payment/approve",
      {
        cid: "TC0ONETIME", // 가맹점 코드
        tid: tid, // 결제 준비 요청에서 얻은 TID
        partner_order_id: "order_id_123", // 가맹점 주문번호
        partner_user_id: "user_id_123", // 가맹점 회원 ID
        pg_token: pg_token, // 결제 성공 시 발급된 pg_token
        total_amount: total_amount,
      },
      {
        headers: {
          Authorization: `KakaoAK ${ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    res.json(response.data);
    console.log("결제 성공");
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "결제 실패" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
