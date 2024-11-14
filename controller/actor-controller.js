class Actor {
    constructor(db) {
        this.db = db; // 데이터베이스 연결 객체
    }

    // 배우 이름 업데이트
    updateActorRole(role, callback) {
        let actorid = 0;
        let actorname = '';

        switch (role) {
            case 'mentor':
                actorid = 2;
                actorname = '멘토';
                break;
            case 'mentee':
                actorid = 1;
                actorname = '멘티';
                break;
            case 'professor':
                actorid = 3;
                actorname = '교수';
                break;
            default:
                return callback('잘못된 역할입니다.');
        }

        const updateQuery = 'UPDATE Actors SET actorid = ?, actorname = ? WHERE id = 1';
        this.db.query(updateQuery, [actorid, actorname], callback);
    }

    // 배우 이름 조회
    getActorName(callback) {
        const query = 'SELECT actorname FROM Actors WHERE id = 1';
        this.db.query(query, callback);
    }
}

module.exports = Actor;
