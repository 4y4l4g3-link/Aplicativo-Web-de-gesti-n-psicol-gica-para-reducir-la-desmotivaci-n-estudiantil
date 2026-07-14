from Backend.app.controllers.stress_controller import stress_bp

def register_routes(app):
    app.register_blueprint(stress_bp, url_prefix='/api/evaluaciones-estres')