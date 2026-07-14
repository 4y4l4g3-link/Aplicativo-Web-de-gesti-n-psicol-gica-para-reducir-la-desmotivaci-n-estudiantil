from flask import Blueprint, request, jsonify
from Backend.app.services.emotion_service import EmotionService
from Backend.app.utils.jwt import token_required

emotion_bp = Blueprint('emotion', __name__)
emotion_service = EmotionService()

@emotion_bp.route('/', methods=['POST'])
@token_required
def create_emotion(usuario):
    data = request.json
    data = dict(data or {})
    data['usuario_id'] = usuario.id
    emotion = emotion_service.create_emotion(data)
    # Devolver formato consistente: {mensaje, emocion}
    return jsonify({
        'mensaje': 'Emoción creada correctamente',
        'emocion': emotion
    }), 201

@emotion_bp.route('/', methods=['GET'])
@token_required
def list_emotions(usuario):
    emotions = emotion_service.list_all_emotions()
    return jsonify(emotions)

@emotion_bp.route('/<int:emotion_id>', methods=['GET'])
@token_required
def get_emotion(usuario, emotion_id):
    emotion = emotion_service.get_emotion(emotion_id)
    return jsonify(emotion)

# Add other routes as needed (PUT, DELETE, etc.) following the same pattern