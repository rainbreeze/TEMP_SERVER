// comments.js
class Comments {
    constructor(db) {
        this.db = db;  // 데이터베이스 연결 객체
    }

    // 특정 강의에 대한 댓글 조회
    getCommentsByLectureId(lectureId, callback) {
        const query = 'SELECT * FROM comments WHERE lectureid = ? ORDER BY created_at DESC';
        this.db.query(query, [lectureId], callback);
    }

    // 댓글 추가
    addComment(lectureId, comment, commentor = '익명', callback) {
        // commentor가 제공되지 않으면 '익명'으로 설정
        const query = 'INSERT INTO comments (lectureid, comment, commentor, created_at) VALUES (?, ?, ?, NOW())';
        this.db.query(query, [lectureId, comment, commentor], callback);
    }

    // 댓글 삭제 (선택적 기능)
    deleteComment(commentId, callback) {
        const query = 'DELETE FROM comments WHERE id = ?';
        this.db.query(query, [commentId], callback);
    }

    // 댓글 수정 (선택적 기능)
    updateComment(commentId, newComment, callback) {
        const query = 'UPDATE comments SET comment = ?, updated_at = NOW() WHERE id = ?';
        this.db.query(query, [newComment, commentId], callback);
    }
}

module.exports = Comments;
