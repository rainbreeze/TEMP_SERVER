class Routes {
    constructor(app, lectures, actors, comments) {
        this.app = app;  // express app
        this.lectures = lectures;
        this.actors = actors;
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

        // 댓글 추가 API
        this.app.post('/comments', (req, res) => {
            const { lectureid, comment, commentor } = req.body;

            // 필수 필드 체크
            if (!lectureid || !comment) {
                return res.status(400).send('lectureid와 comment는 필수입니다.');
            }

            // commentor가 없으면 '익명'으로 처리
            const commenter = commentor || '익명';

            // Comments 객체를 사용하여 댓글을 추가
            this.comments.addComment(lectureid, comment, commenter, (err, results) => {
                if (err) {
                    return res.status(500).send('댓글 추가 실패');
                }

                res.status(201).send('댓글이 추가되었습니다.');
            });
        });

        // 댓글 조회 API (강의 ID에 대한 댓글 가져오기)
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
