const express = require('express');
const cors = require('cors');
const Lectures = require('./models/lectures');
const Actors = require('./models/actors');
const Comments = require('./models/comments');  // 댓글 처리를 위한 Comments 클래스 추가
const db = require('./db/database');  // database.js에서 db 연결을 가져옵니다.
const Routes = require('./routes');  // 방금 만든 Routes 클래스

class Server {
    constructor() {
        this.app = express();  // express 앱 인스턴스
        this.port = process.env.PORT || 3000;  // 포트 설정

        // 객체 생성: Lectures, Actors, Comments 클래스 인스턴스
        this.lectures = new Lectures(db);
        this.actors = new Actors(db);
        this.comments = new Comments(db);  // Comments 객체 생성

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
        // Routes 클래스에 app, lectures, actors, comments 객체 전달
        new Routes(this.app, this.lectures, this.actors, this.comments);
    }

    // 서버 시작 메서드
    start() {
        this.app.listen(this.port, () => {
            console.log(`서버가 ${this.port} 포트에서 실행 중입니다.`);
        });
    }
}

module.exports = Server;
