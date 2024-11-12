const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();  // .env 파일 로드

const app = express();
const port = process.env.PORT || 3000;

// CORS 설정 (모든 출처에서의 접근을 허용)
app.use(cors());

// JSON 형식의 요청 본문을 처리할 수 있도록 설정
app.use(express.json());

// MySQL 연결 설정
const db = mysql.createConnection({
    uri: process.env.DATABASE_URL, // DATABASE_URL을 .env 파일에서 가져옵니다.
});

// MySQL 연결 확인
db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL에 연결되었습니다.');
});

app.get('/redirecthtml/:path', (req, res) => {
    const path = req.params.path;  // 요청된 경로 (예: lecture/lecture.html)
    console.log('Redirect path:', path);
    res.json({ redirectTo: path });
});

app.post('/login/:role', (req, res) => {
    const role = req.params.role;  // 'mentor', 'mentee', 'professor' 중 하나
    let actorid = 0;
    let actorname = '';

    // 역할에 따라 actorid와 actorname을 설정
    switch (role) {
        case 'mentor':
            actorid = 2;
            actorname = '멘토';
            break;
        case 'mentee':
            actorid = 1;
            actorname = '멘티';
            break;
        case 'professor':
            actorid = 3; // 예시로 교수는 actorid 3을 사용
            actorname = '교수';
            break;
        default:
            return res.status(400).send('잘못된 역할입니다.');
    }

    // 해당 actorid와 actorname을 수정하는 쿼리 실행
    const updateQuery = 'UPDATE Actors SET actorname = ? WHERE actorid = ?';
    db.query(updateQuery, [actorname, actorid], (err, results) => {
        if (err) {
            console.error('업데이트 오류:', err);
            return res.status(500).send('배우 정보 업데이트 실패');
        }

        // 성공적으로 업데이트되었다면
        res.send({ message: `${actorname}으로 역할이 변경되었습니다.` });
    });
});

// actorname을 가져오는 API
app.get('/actorname', (req, res) => {
    const query = 'SELECT actorname FROM Actors WHERE actorid = 1';  // id가 1인 actorname만 가져옵니다 (예: '멘티' 또는 '멘토')
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('DB 오류:', err);
            return res.status(500).send('배우 이름을 가져오는 데 실패했습니다.');
        }

        // 결과가 없다면
        if (results.length === 0) {
            return res.status(404).send('배우 데이터가 없습니다.');
        }

        res.json({ actorname: results[0].actorname });
    });
});

// 데이터 조회 API (강의 목록 가져오기)
app.get('/lectures', (req, res) => {
    db.query('SELECT * FROM lectures', (err, results) => {
        if (err) {
            res.status(500).send('데이터 조회 실패');
            return;
        }
        res.json(results);
    });
});

// 강의 삽입 API (새 강의 추가)
app.post('/lectures', (req, res) => {
    const { lecturenumber, content, link, star, good } = req.body;

    if (!lecturenumber || !content || !link || !star) {
        return res.status(400).send('모든 필드를 입력해야 합니다.');
    }

    const query = `
        INSERT INTO lectures (lecturenumber, content, link, star, good)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [lecturenumber, content, link, star, good], (err, results) => {
        if (err) {
            console.error('강의 추가 오류:', err);
            return res.status(500).send('강의 추가 실패');
        }
        res.status(201).send('강의가 추가되었습니다.');
    });
});

// 강의 삭제 API
app.delete('/lectures/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM lectures WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('강의 삭제 오류:', err);
            return res.status(500).send('강의 삭제 실패');
        }
        res.send('강의가 삭제되었습니다.');
    });
});

// 강의 좋아요 증가 API
app.put('/lectures', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('강의 ID를 제공해야 합니다.');
    }

    db.query('UPDATE lectures SET good = good + 1 WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('좋아요 증가 오류:', err);
            return res.status(500).send('좋아요 증가 실패');
        }
        res.send('좋아요가 증가되었습니다.');
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
