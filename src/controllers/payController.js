import fetch from "node-fetch";
import "dotenv/config";

export const readyPay = async (req, res) => {
  const { item_name: productName, total_amount: productPrice } = req.body;
  // const productName = "상품명"; // 상품 이름 설정
  // const productPrice = "10000"; // 상품 가격 설정

  const headers = {
    Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = new URLSearchParams();
  data.append("cid", "TC0ONETIME");
  data.append("partner_order_id", "1001");
  data.append("partner_user_id", "gorany");
  data.append("item_name", productName);
  data.append("quantity", "1");
  data.append("total_amount", productPrice);
  data.append("tax_free_amount", "0");
  data.append(
    "approval_url",
    "https://port-0-kiosk-server-euegqv2blnemb8x8.sel5.cloudtype.app/pay/success"
  );
  data.append(
    "cancel_url",
    "https://port-0-kiosk-server-euegqv2blnemb8x8.sel5.cloudtype.app/pay/cancel"
  );
  data.append(
    "fail_url",
    "https://port-0-kiosk-server-euegqv2blnemb8x8.sel5.cloudtype.app/pay/fali"
  );

  try {
    const response = await fetch("https://kapi.kakao.com/v1/payment/ready", {
      method: "POST",
      headers,
      body: data,
    });

    const responseData = await response.json();
    console.log("요청 성공!"); // 결제 요청 결과 출력
    return res.status(200).json({
      ok: true,
      url: responseData.next_redirect_pc_url,
      tid: responseData.tid,
    }); // 요청 성공 응답
  } catch (error) {
    console.error(error);
    return res.status(400).json({ ok: false, url: null }); // 요청 실패 응답
  }
};

export const approvePay = async (req, res) => {
  const { tid: tid, pg_token: pgToken, total_amount: productPrice } = req.body;

  const headers = {
    Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = new URLSearchParams();
  data.append("cid", "TC0ONETIME");
  data.append("tid", tid);
  data.append("partner_order_id", "1001");
  data.append("partner_user_id", "gorany");
  data.append("pg_token", pgToken);
  data.append("total_amount", productPrice);

  try {
    const response = await fetch("https://kapi.kakao.com/v1/payment/approve", {
      method: "POST",
      headers,
      body: data,
    });

    const responseData = await response.json();
    console.log("승인 성공!"); // 결제 요청 결과 출력
    return res.status(200).json({
      ok: true,
      data: responseData,
    }); // 요청 성공 응답
  } catch (error) {
    console.error(error);
    return res.status(400).json({ ok: false, data: null }); // 요청 실패 응답
  }
};

export const paySuccess = async (req, res) => {
  return res.status(200).send("<h1>결제 진행중.. 기달려주세요.</h1>");
};

export const payCancel = async (req, res) => {
  return res.status(200).json("<h1>pay Cancel</h1>");
};

export const payFail = async (req, res) => {
  return res.status(200).json("<h1>pay Fail</h1>");
};

export const payFinalSuccess = async (req, res) => {
  return res.status(200).send("<h1>결제가 완료되었습니다.</h1>");
};

export const payFinalFail = async (req, res) => {
  return res.status(200).send("<h1>결제에 실패했습니다.</h1>");
};
