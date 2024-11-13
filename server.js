// 서버 설정 클래스
class Server {
    constructor(port, db) {
        this.port = port;
        this.db = db;
        this.app = require('express')();
        this.config();
    }

    // 서버 기본 설정
    config() {
        this.app.use(require('cors')());
        this.app.use(require('express').json());
    }

    // 라우터 설정
    routes() {
        const lectureController = new LectureController(this.db);
        const actorController = new ActorController(this.db);
        
        this.app.get('/redirecthtml/:path', (req, res) => lectureController.redirect(req, res));
        this.app.post('/login/:role', (req, res) => actorController.login(req, res));
        this.app.get('/actorname', (req, res) => actorController.getActorName(req, res));
        this.app.get('/lectures', (req, res) => lectureController.getLectures(req, res));
        this.app.post('/lectures', (req, res) => lectureController.addLecture(req, res));
        this.app.delete('/lectures/:id', (req, res) => lectureController.deleteLecture(req, res));
        this.app.put('/lectures', (req, res) => lectureController.incrementLikes(req, res));
    }

    // 서버 시작
    start() {
        this.app.listen(this.port, () => {
            console.log(`서버가 ${this.port} 포트에서 실행 중입니다.`);
        });
    }
}

// 데이터베이스 연결 클래스
class Database {
    constructor() {
        const mysql = require('mysql2');
        this.connection = mysql.createConnection({
            uri: process.env.DATABASE_URL, // 환경 변수를 통해 DB URL을 가져옵니다
        });
    }

    // MySQL 연결 확인
    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error('MySQL 연결 오류:', err);
                return;
            }
            console.log('MySQL에 연결되었습니다.');
        });
    }

    // 쿼리 실행
    query(sql, params, callback) {
        this.connection.query(sql, params, callback);
    }
}

// 강의 관련 API 처리
class LectureController {
    constructor(db) {
        this.db = db;
    }

    // 강의 목록 조회
    getLectures(req, res) {
        this.db.query('SELECT * FROM lectures', [], (err, results) => {
            if (err) {
                res.status(500).send('데이터 조회 실패');
                return;
            }
            res.json(results);
        });
    }

    // 강의 추가
    addLecture(req, res) {
        const { lecturenumber, content, link, star, good } = req.body;
        if (!lecturenumber || !content || !link || !star) {
            return res.status(400).send('모든 필드를 입력해야 합니다.');
        }

        const query = `
            INSERT INTO lectures (lecturenumber, content, link, star, good)
            VALUES (?, ?, ?, ?, ?)
        `;
        this.db.query(query, [lecturenumber, content, link, star, good], (err, results) => {
            if (err) {
                console.error('강의 추가 오류:', err);
                return res.status(500).send('강의 추가 실패');
            }
            res.status(201).send('강의가 추가되었습니다.');
        });
    }

    // 강의 삭제
    deleteLecture(req, res) {
        const { id } = req.params;
        this.db.query('DELETE FROM lectures WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('강의 삭제 오류:', err);
                return res.status(500).send('강의 삭제 실패');
            }
            res.send('강의가 삭제되었습니다.');
        });
    }

    // 강의 좋아요 증가
    incrementLikes(req, res) {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send('강의 ID를 제공해야 합니다.');
        }

        this.db.query('UPDATE lectures SET good = good + 1 WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('좋아요 증가 오류:', err);
                return res.status(500).send('좋아요 증가 실패');
            }
            res.send('좋아요가 증가되었습니다.');
        });
    }

    // 리디렉션 처리
    redirect(req, res) {
        const path = req.params.path;  // 요청된 경로
        console.log('Redirect path:', path);
        res.json({ redirectTo: path });
    }
}

// 배우 관련 API 처리
class ActorController {
    constructor(db) {
        this.db = db;
    }

    // 로그인 및 역할 변경
    login(req, res) {
        const role = req.params.role;
        let actorid = 0;
        let actorname = '';

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
                actorid = 3;
                actorname = '교수';
                break;
            default:
                return res.status(400).send('잘못된 역할입니다.');
        }

        const updateQuery = 'UPDATE Actors SET actorid = ?, actorname = ? WHERE id = 1';
        this.db.query(updateQuery, [actorid, actorname], (err, results) => {
            if (err) {
                console.error('업데이트 오류:', err);
                return res.status(500).send('배우 정보 업데이트 실패');
            }
            res.send({ message: `${actorname}으로 역할이 변경되었습니다.` });
        });
    }

    // actorname 조회
    getActorName(req, res) {
        const query = 'SELECT actorname FROM Actors WHERE id = 1';
        this.db.query(query, [], (err, results) => {
            if (err) {
                console.error('DB 오류:', err);
                return res.status(500).send('배우 이름을 가져오는 데 실패했습니다.');
            }
            if (results.length === 0) {
                return res.status(404).send('배우 데이터가 없습니다.');
            }
            res.json({ actorname: results[0].actorname });
        });
    }
}

// 서버와 데이터베이스 초기화
const db = new Database();
db.connect();  // MySQL 연결

const server = new Server(process.env.PORT || 3000, db);
server.routes();  // 라우터 설정
server.start();  // 서버 시작
