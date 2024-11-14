const express = require('express');
const cors = require('cors');
const db = require('./db/database');
const Lecture = require('./models/lecture');
const Actor = require('./models/actor');
const Comment = require('./models/comment');
const ActorController = require('./controllers/actorcontroller');
const CommentController = require('./controllers/commentcontroller');
const LectureController = require('./controllers/lecturecontroller');
const Routes = require('./routes/routes');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        // 객체 생성
        this.lectures = new Lecture(db);
        this.actors = new Actor(db);
        this.comments = new Comment(db);

        // 각 컨트롤러 인스턴스 생성
        this.actorController = new ActorController(this.actors);
        this.commentController = new CommentController(this.comments);
        this.lectureController = new LectureController(this.lectures);

        // 서버 미들웨어 설정
        this.setupMiddlewares();

        // 라우터 설정
        this.setupRoutes();
    }

    setupMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    setupRoutes() {
        new Routes(this.app, this.lectureController, this.actorController, this.commentController);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`서버가 ${this.port} 포트에서 실행 중입니다.`);
        });
    }
}

module.exports = Server;
