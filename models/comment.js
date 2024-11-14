// comments.js
class Comment {
    constructor(db) {
        this.db = db;  // 데이터베이스 연결 객체
    }

    // 특정 강의에 대한 댓글 조회
    getCommentsByLectureId(lectureId, callback) {
        const query = 'SELECT * FROM comments WHERE lectureid = ? ORDER BY id DESC';  // 댓글 ID 기준 내림차순 정렬
        this.db.query(query, [lectureId], callback);
    }

    // 댓글 추가
    addComment(lectureId, comment, commentor = '익명', callback) {
        // commentor가 제공되지 않으면 '익명'으로 설정
        const query = 'INSERT INTO comments (lectureid, comment, commentor) VALUES (?, ?, ?)';
        this.db.query(query, [lectureId, comment, commentor], callback);
    }

    // 댓글 삭제
    deleteComment(commentId, callback) {
        const query = 'DELETE FROM comments WHERE id = ?';
        this.db.query(query, [commentId], callback);
    }

    // 댓글 수정
    updateComment(commentId, newComment, callback) {
        const query = 'UPDATE comments SET comment = ? WHERE id = ?';
        this.db.query(query, [newComment, commentId], callback);
    }
}

module.exports = Comment;
