// commentController.js
class CommentController {
    constructor(comment) {
        this.comment = comment;  // Comment 모델을 의존성 주입
    }

    // 특정 강의에 대한 댓글 조회
    getCommentsByLectureId(req, res) {
        const { lectureid } = req.params;
        this.comment.getCommentsByLectureId(lectureid, (err, results) => {
            if (err) {
                return res.status(500).send('댓글 조회 실패');
            }
            res.json(results);
        });
    }

    // 댓글 추가
    addComment(req, res) {
        const { lectureid, comment, commentor } = req.body;
        const commenter = commentor || '익명';  // '익명' 기본값 설정

        if (!lectureid || !comment) {
            return res.status(400).send('lectureid와 comment는 필수입니다.');
        }

        this.comment.addComment(lectureid, comment, commenter, (err, results) => {
            if (err) {
                return res.status(500).send('댓글 추가 실패');
            }
            res.status(201).send('댓글이 추가되었습니다.');
        });
    }

    // 댓글 삭제
    deleteComment(req, res) {
        const { commentId } = req.params;
        this.comment.deleteComment(commentId, (err, results) => {
            if (err) {
                return res.status(500).send('댓글 삭제 실패');
            }
            res.send('댓글이 삭제되었습니다.');
        });
    }

    // 댓글 수정
    updateComment(req, res) {
        const { commentId } = req.params;
        const { newComment } = req.body;

        if (!newComment) {
            return res.status(400).send('새로운 댓글 내용이 필요합니다.');
        }

        this.comment.updateComment(commentId, newComment, (err, results) => {
            if (err) {
                return res.status(500).send('댓글 수정 실패');
            }
            res.send('댓글이 수정되었습니다.');
        });
    }
}

module.exports = CommentController;
