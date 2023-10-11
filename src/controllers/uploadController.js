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
  projectId: "order-d87d5",
  client_email: "firebase-adminsdk-wfonf@order-d87d5.iam.gserviceaccount.com",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC3gGdlLRWhtmfY\nXRKyuIMVPNUwiZvlzoNgJi06erIO6hGU6betCV3U5456Ogp6GKpotI8jEaLTRyis\nCHQ1vLk7Stg0omWiGOTTTiapcMz+wMV12OyWfXfh5vmL1X73mdo4t4TYrOLvO+wj\nNd1MuPSDDPTr4izf8+THNZJtBh+eVBmanQppZyMVe6BpbB+Kco77CF521ctDDkCD\nDzUWHOZ+iJuMAhuUWNi71iVS15I36k5JeYrKkO1ak6mLgLsNmf01c99/mRjdY6lg\nPdwt3PA5755FdUp0rvNw2C4psUnLOL2vttrmrpQiPbs6Skw092ZKAsuhEMG+XKpQ\nUOuTBBeBAgMBAAECggEAA3NEXmxj1vvPRYvwdVBPVKelaYl41zAUG8tz98DFVs7z\nYC2p0LTXoRBuhyFOv591mszkURg8i8TvgJaTGsyO3gzI9mpkR1E5AjkatH5kuFiH\nDfFzd1vqFGMLp6OuxLiNmBnpQ0qy5KUnijzxyYbDwDAO7d19kwNqto0tEOQ31Xn+\nlqtZLmpUk1iobnx3T2/v/JwKUJG0I+f3iwYQR7EZa+uZ+DzqIzGD21IGmP2oA0TQ\noQa2Q2eWCGHw+Fudx0a6bW1HpP+jkc1skZnrGbec44EZ+MwyKtSIk+FWfN74cMvP\nfXO7ailRm4zwC2HKg0i23uxbnZhIy/3DansyPfIkcQKBgQD9A0k3rGFOkKytGYoQ\nLWbN3akq492gUrFcrLSrjVDw4nERGSmcjfyymLbqqgIXnzcyB0F2Ly/eu3vOr8q5\ntp/bUSuIDxUprFPrf1prlOt6ZDvDyYi3Q670Q7n/f6TczNIwK2B4Fq0b0yUBJFiU\nie+W4wfcwLIMLZrI3oiILMUs+QKBgQC5qwZdC4zEBJP+3TntumDKtqJEviArBR2W\ntkk7G4uV1TfrtYFsQMIKOp9FqrPtL6p1QrgzvseljvItytA0koxLTj51ZsvNPJfK\n9iIwvPGKyw6ydhJ/I1nDkeTsMVq8F1STLO6xx5hle5j+KUyT+K6Mokwadjr/rMqF\nhCU0yCwIyQKBgQCjXpTPUwo93aLx3pTMX1SLRz5tSFcZp2uIqKe8QfJqp/xUCwhY\nY0Iw2/T4TzAsqozMS+0T7+IcErkdu1rOUcKkraPLJdoHX5OMc14iKzVlgQUqJZ6W\nnyh/5p9Z/8SnIcXyfn+66wF5/vtc4mgj+XDv38Z63x3YSTYxz6cfLrFemQKBgQCa\nnA5qgOmxeVZ8T2Cj1CYx6C/sKp7C9DmVfSoyLFfqZ2lvwO+LY8mxlut2qhW2l5DM\noMifXmkGNqj49QC4JqjpNLjSLs3blG+ataf3Cf/h4gHVHnl8ocVoFB+bh+XU52Co\nRixmop0HNQtL6rw4JEfGGIhjKL0sl4j18frBn0b78QKBgQCSkRe3Z/MX4EmlIyZB\nLHYYaSgt+kN/z1fOqFNi/FJQ5s51TxCryHM5c7kYyQVS79KG10ZdFNCDF+Rta//X\n77U7hEEGNTOGRCNkE5/S/t1gWxWJ0uSlcVIf/Qeupe8Yw9DUa2h8UrU7UmcJj231\nqclnI0XPs8qZzfMxAIwLaZQcZw==\n-----END PRIVATE KEY-----\n",
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
  next();
};

export default testRouter;
