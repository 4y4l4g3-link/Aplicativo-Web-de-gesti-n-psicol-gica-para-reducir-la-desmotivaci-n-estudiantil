from functools import wraps
from flask import request, jsonify
import jwt
from datetime import datetime, timedelta
from Backend.app.config.config import config
import os

def token_required(f):
    """Decorador para verificar token JWT"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Buscar token en headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'error': 'Token requerido'}), 401
        
        try:
            # Get config for secret key
            env = os.environ.get('FLASK_ENV', 'development')
            secret_key = config[env].SECRET_KEY
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            usuario_id = data['usuario_id']
            # Import Usuario here to avoid circular imports
            from models import Usuario
            usuario = Usuario.query.get(usuario_id)
            if not usuario:
                return jsonify({'error': 'Usuario no encontrado'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        
        return f(usuario, *args, **kwargs)
    
    return decorated


def admin_required(f):
    """Decorador para verificar si es administrador"""
    @wraps(f)
    def decorated(usuario, *args, **kwargs):
        if usuario.rol != 'administrador':
            return jsonify({'error': 'Permiso denegado'}), 403
        return f(usuario, *args, **kwargs)
    
    return decorated


def generar_token(usuario_id, expires_in=None):
    """Generar token JWT"""
    if expires_in is None:
        # Get config for expiration
        env = os.environ.get('FLASK_ENV', 'development')
        expires_in = config[env].JWT_ACCESS_TOKEN_EXPIRES
    
    # Get config for secret key
    env = os.environ.get('FLASK_ENV', 'development')
    secret_key = config[env].SECRET_KEY
    
    payload = {
        'usuario_id': usuario_id,
        'exp': datetime.utcnow() + expires_in,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, secret_key, algorithm='HS256')