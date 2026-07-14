from Backend.app.models.emotion_model import EmotionModel
from Backend.app.repositories.emotion_repository import EmotionRepository

class EmotionService:
    def __init__(self):
        self.repo = EmotionRepository()

    def create_emotion(self, data):
        # Implement business logic here
        emotion = EmotionModel(
            usuario_id=data['usuario_id'],
            estado=data['estado'],
            intensidad=data['intensidad'],
            notas=data.get('notas', '')
        )
        emotion = self.repo.save(emotion)
        return emotion.to_dict()

    def get_emotion(self, emotion_id):
        emotion = self.repo.find_by_id(emotion_id)
        return emotion.to_dict() if emotion else None

    def list_all_emotions(self):
        emotions = self.repo.find_all()
        return [e.to_dict() for e in emotions]