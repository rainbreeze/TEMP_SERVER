// routes/routes.js
class Routes {
    constructor(app, lectures, actorController, comments) {
        this.app = app;  // express app
        this.lectures = lectures;
        this.actorController = actorController;  // 컨트롤러로 전달된 ActorController 인스턴스
        this.comments = comments;

        this.setupRoutes();
    }

    // 라우터 설정
    setupRoutes() {
        // Redirect 경로로 JSON 반환
        this.app.get('/redirecthtml/:path', (req, res) => {
            const path = req.params.path;
            console.log('Redirect path:', path);
            res.json({ redirectTo: path });
        });

        // 로그인 API: actor 역할 업데이트
        this.app.post('/login/:role', (req, res) => {
            this.actorController.updateActorRole(req, res);
        });

        // 배우 이름 조회 API
        this.app.get('/actorname', (req, res) => {
            this.actorController.getActorName(req, res);
        });

        // 강의 관련 API들 (변경 없음)
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

        // 댓글 관련 API들 (변경 없음)
        this.app.post('/comments', (req, res) => {
            const { lectureid, comment, commentor } = req.body;

            // 필수 필드 체크
            if (!lectureid || !comment) {
                return res.status(400).send('lectureid와 comment는 필수입니다.');
            }

            const commenter = commentor || '익명';

            this.comments.addComment(lectureid, comment, commenter, (err, results) => {
                if (err) {
                    return res.status(500).send('댓글 추가 실패');
                }

                res.status(201).send('댓글이 추가되었습니다.');
            });
        });

        // 댓글 조회 API
        this.app.get('/comments/:lectureid', (req, res) => {
            const { lectureid } = req.params;

            this.comments.getCommentsByLectureId(lectureid, (err, results) => {
                if (err) {
                    return res.status(500).send('댓글 조회 실패');
                }
                res.json(results);
            });
        });
    }
}

module.exports = Routes;
