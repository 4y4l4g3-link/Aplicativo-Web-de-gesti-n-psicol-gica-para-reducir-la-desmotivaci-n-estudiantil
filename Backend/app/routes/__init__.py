from Backend.app.routes.emotion_routes import register_routes as register_emotion_routes
from Backend.app.routes.micro_meta_routes import register_routes as register_micro_meta_routes
from Backend.app.routes.stress_routes import register_routes as register_stress_routes
from Backend.app.routes.capsula_routes import register_routes as register_capsula_routes
from Backend.app.routes.dashboard_routes import register_routes as register_dashboard_routes

__all__ = [
    'register_emotion_routes',
    'register_micro_meta_routes',
    'register_stress_routes',
    'register_capsula_routes',
    'register_dashboard_routes'
]