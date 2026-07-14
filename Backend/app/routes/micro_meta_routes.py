from Backend.app.controllers.micro_meta_controller import micro_meta_bp

def register_routes(app):
    app.register_blueprint(micro_meta_bp, url_prefix='/api/micro-metas')