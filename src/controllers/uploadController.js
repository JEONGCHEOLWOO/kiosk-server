// 필요한 모듈을 가져옵니다.
import express from "express";
import multer from "multer";
import path from "path";
import admin from "firebase-admin";
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

// .env 설정 파일을 로드합니다.
dotenv.config();

// Firebase Admin SDK에 사용할 인증 정보를 설정합니다.
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

// Firebase 초기화
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

// Google Cloud Storage 클라이언트 인스턴스 생성
const storage = new Storage({
  projectId: firebaseConfig.projectId,
  credentials: firebaseConfig,
});

// Firebase 프로젝트의 기본 저장소 버킷 참조
export const bucket = storage.bucket("gs://order-d87d5.appspot.com");

// multer를 사용하여 파일을 메모리에 저장
export const upload = multer({
  storage: multer.memoryStorage(),
});

// Express 라우터 인스턴스 생성
const testRouter = express.Router();

// 파일 업로드 엔드포인트를 정의
export const uploadSave = async (req, res, next) => {
  // 업로드 된 파일 데이터를 가져옵니다.
  const { originalname, buffer } = req.file;

  // 파일명을 타임스탬프 기반으로 변경합니다.
  const fileName = `${new Date().getTime()}${path.extname(originalname)}`;
  const file = bucket.file(fileName);

  // Firebase Storage에 파일을 업로드하기 위해 스트림을 사용합니다.
  const writeStream = file.createWriteStream({
    resumable: false,
    public: true,
    contentType: "auto",
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: fileName,
      },
    },
  });

  // 업로드 중 에러 발생 시
  writeStream.on("error", (error) => {
    console.error(`Upload failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  });

  // 업로드가 완료되면 실행됩니다.
  writeStream.on("finish", async () => {
    console.log(`Uploaded file: ${originalname}, Path: ${file.name}`);

    // 생성된 Firebase Storage URL을 반환합니다.
    const url = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(file.name)}?alt=media&token=${fileName}`;
    console.log(`url: ${url}`);
    // res.json({ path: file.name, url });
    req.body.imageURL = url;
    next();
  });

  // 이 메모리에 저장된 파일을 클라우드 스토리지로 전송합니다.
  writeStream.end(buffer);
};

export default testRouter;
