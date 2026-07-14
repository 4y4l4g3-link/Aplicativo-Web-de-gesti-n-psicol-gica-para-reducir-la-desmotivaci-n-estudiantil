from Backend.app.controllers.capsula_controller import capsula_bp

def register_routes(app):
    app.register_blueprint(capsula_bp, url_prefix='/api/capsulas-motivacion')