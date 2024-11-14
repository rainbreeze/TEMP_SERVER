class LectureController {
    constructor(lecture) {
        this.lecture = lecture;  // Lecture 모델을 의존성 주입
    }

    // 모든 강의 조회
    getAllLectures(req, res) {
        this.lecture.getAllLectures((err, results) => {
            if (err) {
                return res.status(500).send('데이터 조회 실패');
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

        this.lecture.addLecture(lecturenumber, content, link, star, good, (err, results) => {
            if (err) {
                return res.status(500).send('강의 추가 실패');
            }
            res.status(201).send('강의가 추가되었습니다.');
        });
    }

    // 강의 삭제
    deleteLecture(req, res) {
        const { id } = req.params;
        this.lecture.deleteLecture(id, (err, results) => {
            if (err) {
                return res.status(500).send('강의 삭제 실패');
            }
            res.send('강의가 삭제되었습니다.');
        });
    }

    // 강의 좋아요 증가
    incrementGood(req, res) {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send('강의 ID를 제공해야 합니다.');
        }

        this.lecture.incrementGood(id, (err, results) => {
            if (err) {
                return res.status(500).send('좋아요 증가 실패');
            }
            res.send('좋아요가 증가되었습니다.');
        });
    }

    // 강의 댓글 수 증가
    incrementComment(req, res) {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send('강의 ID를 제공해야 합니다.');
        }

        this.lecture.incrementComment(id, (err, results) => {
            if (err) {
                return res.status(500).send('댓글 수 증가 실패');
            }
            res.send('댓글 수가 증가되었습니다.');
        });
    }
}

module.exports = LectureController;
