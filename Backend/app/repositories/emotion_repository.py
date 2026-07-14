from Backend.app.database import db
from Backend.app.models.emotion_model import EmotionModel

class EmotionRepository:
    def save(self, emotion):
        db.session.add(emotion)
        db.session.commit()
        return emotion

    def find_by_id(self, emotion_id):
        return db.session.get(EmotionModel, emotion_id)

    def find_all(self):
        return EmotionModel.query.all()