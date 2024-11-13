class Lectures {
    constructor(db) {
        this.db = db;
    }

    // 모든 강의 조회
    getAllLectures(callback) {
        this.db.query('SELECT * FROM lectures', callback);
    }

    // 강의 추가
    addLecture(lecturenumber, content, link, star, good, callback) {
        const query = `
            INSERT INTO lectures (lecturenumber, content, link, star, good, numofcomment)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        // numofcomment는 기본값이므로 0으로 설정
        this.db.query(query, [lecturenumber, content, link, star, good, 0], callback);
    }

    // 강의 삭제
    deleteLecture(id, callback) {
        this.db.query('DELETE FROM lectures WHERE id = ?', [id], callback);
    }

    // 강의 좋아요 증가
    incrementGood(id, callback) {
        const query = 'UPDATE lectures SET good = good + 1 WHERE id = ?';
        this.db.query(query, [id], callback);
    }

    // 강의 댓글 수 증가
    incrementComment(id, callback) {
        const query = 'UPDATE lectures SET numofcomment = numofcomment + 1 WHERE id = ?';
        this.db.query(query, [id], callback);
    }
}

module.exports = Lectures;
