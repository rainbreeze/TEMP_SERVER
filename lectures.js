class Lectures {
    constructor(db) {
        this.db = db; // 데이터베이스 연결 객체
    }

    // 강의 목록 가져오기
    getAllLectures(callback) {
        const query = 'SELECT * FROM lectures';
        this.db.query(query, callback);
    }

    // 강의 추가
    addLecture(lecturenumber, content, link, star, good, callback) {
        const query = `
            INSERT INTO lectures (lecturenumber, content, link, star, good)
            VALUES (?, ?, ?, ?, ?)
        `;
        this.db.query(query, [lecturenumber, content, link, star, good], callback);
    }

    // 강의 삭제
    deleteLecture(id, callback) {
        const query = 'DELETE FROM lectures WHERE id = ?';
        this.db.query(query, [id], callback);
    }

    // 강의 좋아요 증가
    incrementGood(id, callback) {
        const query = 'UPDATE lectures SET good = good + 1 WHERE id = ?';
        this.db.query(query, [id], callback);
    }
}

module.exports = Lectures;
