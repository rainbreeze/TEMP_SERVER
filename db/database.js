const mysql = require('mysql2');
require('dotenv').config();  // .env 파일 로드

// MySQL 연결 설정
const db = mysql.createConnection({
    uri: process.env.MYSQL_PUBLIC_URL, // 공용 URL을 사용
});

// MySQL 연결 확인
db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL에 연결되었습니다.');
});

// db 객체를 다른 파일에서 사용할 수 있도록 내보냄
module.exports = db;
