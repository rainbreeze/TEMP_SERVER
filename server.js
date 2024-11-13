const express = require('express');
const cors = require('cors');
const Lectures = require('./lectures');
const Actors = require('./actors');
const db = require('./database');  // database.js에서 db 연결을 가져옵니다.

class Server {
    constructor() {
        this.app = express();  // express 앱 인스턴스
        this.port = process.env.PORT || 3000;  // 포트 설정

        // 객체 생성: Lectures와 Actors 클래스 인스턴스
        this.lectures = new Lectures(db);
        this.actors = new Actors(db);

        // 서버 미들웨어 설정
        this.setupMiddlewares();

        // 라우터 설정
        this.setupRoutes();
    }

    // 미들웨어 설정
    setupMiddlewares() {
        // CORS 설정 (모든 출처에서의 접근을 허용)
        this.app.use(cors());
        // JSON 형식의 요청 본문을 처리할 수 있도록 설정
        this.app.use(express.json());
    }

    // 라우터 설정
    setupRoutes() {
        // Redirect 경로로 JSON 반환
        this.app.get('/redirecthtml/:path', (req, res) => {
            const path = req.params.path;
            console.log('Redirect path:', path);
            res.json({ redirectTo: path });
        });

        // 로그인 API
        this.app.post('/login/:role', (req, res) => {
            const role = req.params.role;
            this.actors.updateActorRole(role, (err, results) => {
                if (err) {
                    return res.status(400).send(err);
                }
                res.send({ message: `${role}으로 역할이 변경되었습니다.` });
            });
        });

        // actorname을 가져오는 API
        this.app.get('/actorname', (req, res) => {
            this.actors.getActorName((err, results) => {
                if (err) {
                    return res.status(500).send('배우 이름을 가져오는 데 실패했습니다.');
                }
                if (results.length === 0) {
                    return res.status(404).send('배우 데이터가 없습니다.');
                }
                res.json({ actorname: results[0].actorname });
            });
        });

        // 데이터 조회 API (강의 목록 가져오기)
        this.app.get('/lectures', (req, res) => {
            this.lectures.getAllLectures((err, results) => {
                if (err) {
                    return res.status(500).send('데이터 조회 실패');
                }
                res.json(results);
            });
        });

        // 강의 삽입 API
        this.app.post('/lectures', (req, res) => {
            const { lecturenumber, content, link, star, good } = req.body;

            if (!lecturenumber || !content || !link || !star) {
                return res.status(400).send('모든 필드를 입력해야 합니다.');
            }

            this.lectures.addLecture(lecturenumber, content, link, star, good, (err, results) => {
                if (err) {
                    return res.status(500).send('강의 추가 실패');
                }
                res.status(201).send('강의가 추가되었습니다.');
            });
        });

        // 강의 삭제 API
        this.app.delete('/lectures/:id', (req, res) => {
            const { id } = req.params;
            this.lectures.deleteLecture(id, (err, results) => {
                if (err) {
                    return res.status(500).send('강의 삭제 실패');
                }
                res.send('강의가 삭제되었습니다.');
            });
        });

        // 강의 좋아요 증가 API
        this.app.put('/lectures', (req, res) => {
            const { id } = req.body;
            if (!id) {
                return res.status(400).send('강의 ID를 제공해야 합니다.');
            }

            this.lectures.incrementGood(id, (err, results) => {
                if (err) {
                    return res.status(500).send('좋아요 증가 실패');
                }
                res.send('좋아요가 증가되었습니다.');
            });
        });
    }

    // 서버 시작 메서드
    start() {
        this.app.listen(this.port, () => {
            console.log(`서버가 ${this.port} 포트에서 실행 중입니다.`);
        });
    }
}

module.exports = Server;
