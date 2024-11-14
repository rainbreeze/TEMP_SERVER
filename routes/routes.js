class Routes {
    constructor(app, lectureController, actorController, commentController) {
        this.app = app;
        this.lectureController = lectureController;
        this.actorController = actorController;
        this.commentController = commentController;

        this.setupRoutes();
    }

    setupRoutes() {
        // Redirect 경로로 JSON 반환
        this.app.get('/redirecthtml/:path', (req, res) => {
            const path = req.params.path;
            console.log('Redirect path:', path);
            res.json({ redirectTo: path });
        });
        // 로그인 API
        this.app.post('/login/:role', (req, res) => {
            this.actorController.updateActorRole(req, res);
        });

        // 배우 이름 조회 API
        this.app.get('/actorname', (req, res) => {
            this.actorController.getActorName(req, res);
        });

        // 강의 관련 API
        this.app.get('/lectures', (req, res) => {
            this.lectureController.getAllLectures(req, res);
        });

        this.app.post('/lectures', (req, res) => {
            this.lectureController.addLecture(req, res);
        });

        this.app.delete('/lectures/:id', (req, res) => {
            this.lectureController.deleteLecture(req, res);
        });

        this.app.put('/lectures/good', (req, res) => {
            this.lectureController.incrementGood(req, res);
        });

        this.app.put('/lectures/comment', (req, res) => {
            this.lectureController.incrementComment(req, res);
        });

        // 댓글 관련 API
        this.app.post('/comments', (req, res) => {
            this.commentController.addComment(req, res);
        });

        this.app.get('/comments/:lectureid', (req, res) => {
            this.commentController.getCommentsByLectureId(req, res);
        });

        this.app.delete('/comments/:commentId', (req, res) => {
            this.commentController.deleteComment(req, res);
        });

        this.app.put('/comments/:commentId', (req, res) => {
            this.commentController.updateComment(req, res);
        });
    }
}

module.exports = Routes;
