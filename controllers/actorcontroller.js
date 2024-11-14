// controllers/actorController.js
class ActorController {
    constructor(actor) {
        this.actor = actor;  // Actor 모델을 의존성 주입
    }

    // 배우 이름 업데이트
    updateActorRole(req, res) {
        const role = req.params.role;
        this.actor.updateActorRole(role, (err, results) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.send({ message: `${role}으로 역할이 변경되었습니다.` });
        });
    }

    // 배우 이름 조회
    getActorName(req, res) {
        this.actor.getActorName((err, results) => {
            if (err) {
                return res.status(500).send('배우 이름을 가져오는 데 실패했습니다.');
            }
            if (results.length === 0) {
                return res.status(404).send('배우 데이터가 없습니다.');
            }
            res.json({ actorname: results[0].actorname });
        });
    }
}

module.exports = ActorController;
