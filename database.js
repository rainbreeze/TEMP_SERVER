const mysql = require('mysql2');
const url = require('url');
require('dotenv').config();

class Database {
    constructor() {
        // MySQL URL을 .env 파일에서 가져오기
        const dbUrl = process.env.MYSQL_URL; // 내부 URL을 사용
        const parsedUrl = url.parse(dbUrl);

        // URL을 통해 DB 연결 정보 분리
        this.config = {
            host: parsedUrl.hostname,
            user: parsedUrl.auth ? parsedUrl.auth.split(':')[0] : '',
            password: parsedUrl.auth ? parsedUrl.auth.split(':')[1] : '',
            database: parsedUrl.pathname ? parsedUrl.pathname.split('/')[1] : '',
            port: parsedUrl.port || 3306, // 기본 포트 3306
        };

        // 연결 객체 생성
        this.connection = mysql.createConnection(this.config);
    }

    // DB 연결 확인
    connect() {
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    reject(`MySQL 연결 오류: ${err}`);
                } else {
                    resolve('MySQL에 연결되었습니다.');
                }
            });
        });
    }

    // 쿼리 실행
    query(sql, params) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, results) => {
                if (err) {
                    reject(`쿼리 실행 오류: ${err}`);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // 연결 종료
    close() {
        this.connection.end((err) => {
            if (err) {
                console.error('DB 연결 종료 오류:', err);
            } else {
                console.log('DB 연결 종료되었습니다.');
            }
        });
    }
}

module.exports = new Database();
