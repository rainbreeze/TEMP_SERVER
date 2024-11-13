const express = require('express');
const cors = require('cors');
require('dotenv').config();
const database = require('./database');  // Database.js에서 정의한 인스턴스를 불러옵니다.

const app = express();
const port = process.env.PORT || 3000;

// CORS 설정 (모든 출처에서의 접근을 허용)
app.use(cors());

// JSON 형식의 요청 본문을 처리할 수 있도록 설정
app.use(express.json());

// MySQL 연결 확인
database.connect()
    .then((message) => console.log(message))  // 연결 성공 시 메시지 출력
    .catch((error) => console.error(error));  // 연결 실패 시 에러 메시지 출력

// 데이터 조회 API (강의 목록 가져오기)
app.get('/lectures', async (req, res) => {
    try {
        const lectures = await database.query('SELECT * FROM lectures');
        res.json(lectures);  // 강의 목록 반환
    } catch (error) {
        console.error('데이터 조회 실패:', error);
        res.status(500).send('데이터 조회 실패');
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
