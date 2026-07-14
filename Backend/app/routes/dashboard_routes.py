from Backend.app.controllers.dashboard_controller import dashboard_bp


def register_routes(app):
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
