// server.js
const express = require('express');
const cors = require('cors');
const Lecture = require('./models/lecture');
const Actor = require('./models/actor');
const Comment = require('./models/comment');  // 댓글 처리를 위한 Comments 클래스 추가
const db = require('./db/database');  // database.js에서 db 연결을 가져옵니다.
const ActorController = require('./controllers/actorController');  // 새로 만든 ActorController
const Routes = require('./routes/routes');  // Routes 클래스

class Server {
    constructor() {
        this.app = express();  // express 앱 인스턴스
        this.port = process.env.PORT || 3000;  // 포트 설정

        // 객체 생성: Lectures, Actors, Comments 클래스 인스턴스
        this.lectures = new Lecture(db);
        this.actors = new Actor(db);
        this.comments = new Comment(db);  // Comments 객체 생성

        // ActorController 인스턴스 생성
        this.actorController = new ActorController(this.actors);

        // 서버 미들웨어 설정
        this.setupMiddlewares();

        // 라우터 설정
        this.setupRoutes();
    }

    // 미들웨어 설정
    setupMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    // 라우터 설정
    setupRoutes() {
        new Routes(this.app, this.lectures, this.actorController, this.comments);
    }

    // 서버 시작 메서드
    start() {
        this.app.listen(this.port, () => {
            console.log(`서버가 ${this.port} 포트에서 실행 중입니다.`);
        });
    }
}

module.exports = Server;
