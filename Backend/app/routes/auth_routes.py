from flask import Blueprint
from Backend.app.utils.jwt import token_required
from Backend.app.controllers.auth_controller import register, login, get_current_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/register', methods=['POST'])
def register_route():
    return register()

@auth_bp.route('/api/auth/login', methods=['POST'])
def login_route():
    return login()

@auth_bp.route('/api/auth/me', methods=['GET'])
@token_required
def me():
    return get_current_user()