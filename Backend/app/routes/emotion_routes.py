from Backend.app.controllers.emotion_controller import emotion_bp

def register_routes(app):
    app.register_blueprint(emotion_bp, url_prefix='/api/emociones')