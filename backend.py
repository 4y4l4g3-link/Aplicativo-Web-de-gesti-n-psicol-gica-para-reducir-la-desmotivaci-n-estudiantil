"""
MenteActiva - Backend Flask
Aplicativo Web de Gestión Psicológica para Reducir la Desmotivación Estudiantil
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
from functools import wraps
import os

# Importar configuración y modelos
from Backend.app.config.config import config
from models import db, Usuario, Emocion, MicroMeta, EvaluacionEstres, CapsulasMotivacion

# Importar rutas de módulos migrados a Clean Architecture
from Backend.app.routes.emotion_routes import register_routes as register_emotion_routes
from Backend.app.routes.micro_meta_routes import register_routes as register_micro_meta_routes
from Backend.app.routes.stress_routes import register_routes as register_stress_routes
from Backend.app.routes.capsula_routes import register_routes as register_capsula_routes
from Backend.app.routes.dashboard_routes import register_routes as register_dashboard_routes

# Crear aplicación Flask
app = Flask(__name__)

# Cargar configuración
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[env])

# Inicializar extensiones
db.init_app(app)
CORS(app, resources={
    r"/api/*": {
        "origins": app.config['CORS_ORIGINS'],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Crear carpeta de uploads
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ==================== UTILIDADES ====================

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
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            usuario_id = data['usuario_id']
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
        expires_in = app.config['JWT_ACCESS_TOKEN_EXPIRES']

    payload = {
        'usuario_id': usuario_id,
        'exp': datetime.utcnow() + expires_in,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


# ==================== AUTENTICACIÓN ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """
    Registrar nuevo usuario
    POST /api/auth/register
    {
        "email": "user@email.com",
        "nombre": "Juan",
        "password": "1234"
    }
    """
    data = request.get_json()

    # Validaciones
    if not data or not data.get('email') or not data.get('password') or not data.get('nombre'):
        return jsonify({'error': 'Email, nombre y contraseña son requeridos'}), 400

    # Verificar si usuario existe
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    try:
        # Crear nuevo usuario
        nuevo_usuario = Usuario(
            email=data['email'],
            nombre=data['nombre'],
            rol='estudiante'  # Por defecto
        )
        nuevo_usuario.set_password(data['password'])

        db.session.add(nuevo_usuario)
        db.session.commit()

        # Generar token
        token = generar_token(nuevo_usuario.id)

        return jsonify({
            'mensaje': 'Usuario registrado exitosamente',
            'usuario': nuevo_usuario.to_dict(),
            'token': token
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Iniciar sesión
    POST /api/auth/login
    {
        "email": "test@email.com",
        "password": "1234"
    }
    """
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña son requeridos'}), 400

    usuario = Usuario.query.filter_by(email=data['email']).first()

    if not usuario or not usuario.check_password(data['password']):
        return jsonify({'error': 'Email o contraseña inválidos'}), 401

    if not usuario.activo:
        return jsonify({'error': 'Usuario inactivo'}), 403

    # Generar token
    token = generar_token(usuario.id)

    return jsonify({
        'mensaje': 'Sesión iniciada',
        'usuario': usuario.to_dict(),
        'token': token
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(usuario):
    """
    Obtener usuario actual
    GET /api/auth/me
    """
    return jsonify(usuario.to_dict()), 200


# ==================== GESTIÓN DE USUARIOS (ADMIN) ====================

@app.route('/api/usuarios', methods=['GET'])
@token_required
@admin_required
def listar_usuarios(usuario):
    """
    Listar todos los usuarios (solo admin)
    GET /api/usuarios
    """
    try:
        usuarios = Usuario.query.all()
        return jsonify([u.to_dict() for u in usuarios]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/usuarios/<int:usuario_id>', methods=['GET'])
@token_required
@admin_required
def obtener_usuario(usuario, usuario_id):
    """
    Obtener usuario específico (solo admin)
    GET /api/usuarios/<id>
    """
    try:
        usuario_target = Usuario.query.get(usuario_id)
        if not usuario_target:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        return jsonify(usuario_target.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/usuarios', methods=['POST'])
@token_required
@admin_required
def crear_usuario(usuario):
    """
    Crear nuevo usuario (solo admin)
    POST /api/usuarios
    {
        "email": "new@email.com",
        "nombre": "Pedro",
        "password": "1234",
        "rol": "estudiante"
    }
    """
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password') or not data.get('nombre'):
        return jsonify({'error': 'Email, nombre y contraseña son requeridos'}), 400

    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 409

    try:
        nuevo_usuario = Usuario(
            email=data['email'],
            nombre=data['nombre'],
            rol=data.get('rol', 'estudiante')
        )
        nuevo_usuario.set_password(data['password'])

        db.session.add(nuevo_usuario)
        db.session.commit()

        return jsonify({
            'mensaje': 'Usuario creado',
            'usuario': nuevo_usuario.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/usuarios/<int:usuario_id>', methods=['PUT'])
@token_required
@admin_required
def actualizar_usuario(usuario, usuario_id):
    """
    Actualizar usuario (solo admin)
    PUT /api/usuarios/<id>
    {
        "nombre": "Nuevo Nombre",
        "rol": "administrador",
        "activo": true
    }
    """
    usuario_target = Usuario.query.get(usuario_id)
    if not usuario_target:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    data = request.get_json()

    try:
        if 'nombre' in data:
            usuario_target.nombre = data['nombre']
        if 'rol' in data:
            usuario_target.rol = data['rol']
        if 'activo' in data:
            usuario_target.activo = data['activo']

        db.session.commit()

        return jsonify({
            'mensaje': 'Usuario actualizado',
            'usuario': usuario_target.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/usuarios/<int:usuario_id>', methods=['DELETE'])
@token_required
@admin_required
def eliminar_usuario(usuario, usuario_id):
    """
    Eliminar usuario (solo admin)
    DELETE /api/usuarios/<id>
    """
    usuario_target = Usuario.query.get(usuario_id)
    if not usuario_target:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # No permitir eliminar el único admin
    if usuario_target.rol == 'administrador':
        admin_count = Usuario.query.filter_by(rol='administrador').count()
        if admin_count == 1:
            return jsonify({'error': 'No se puede eliminar el único administrador'}), 400

    try:
        db.session.delete(usuario_target)
        db.session.commit()

        return jsonify({'mensaje': 'Usuario eliminado'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== ARCHIVOS ====================

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """
    Servir archivo subido
    GET /uploads/<filename>
    """
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return jsonify({'error': 'Archivo no encontrado'}), 404


# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Verificar salud de la API
    GET /api/health
    """
    return jsonify({'status': 'ok'}), 200


# ==================== REGISTRO DE BLUEPRINTS (CLEAN ARCHITECTURE) ====================
# Los módulos de Emociones, Micro-Metas, Evaluaciones de Estrés y Cápsulas
# se registran únicamente a través de sus Blueprints. La lógica original de
# backend.py para estos módulos fue migrada a controllers/services/repositories.

register_emotion_routes(app)
register_micro_meta_routes(app)
register_stress_routes(app)
register_capsula_routes(app)
register_dashboard_routes(app)


# ==================== INICIALIZAR BD Y EJECUTAR ====================

def init_db():
    """Inicializar base de datos con datos de prueba"""
    with app.app_context():
        # Crear todas las tablas
        db.create_all()

        # Crear usuario admin de prueba si no existe
        admin = Usuario.query.filter_by(email='admin@menteactiva.com').first()
        if not admin:
            admin = Usuario(
                email='admin@menteactiva.com',
                nombre='Administrador',
                rol='administrador'
            )
            admin.set_password('admin123')
            db.session.add(admin)

        # Crear usuario estudiante de prueba si no existe
        estudiante = Usuario.query.filter_by(email='test@email.com').first()
        if not estudiante:
            estudiante = Usuario(
                email='test@email.com',
                nombre='Estudiante Test',
                rol='estudiante'
            )
            estudiante.set_password('1234')
            db.session.add(estudiante)

        # Crear algunas cápsulas de motivación si no existen
        if CapsulasMotivacion.query.count() == 0:
            capsulas = [
                CapsulasMotivacion(
                    titulo='Motivación para Estudiar',
                    contenido='Cada pequeño paso te acerca a tu meta. No abandones.',
                    tipo='texto',
                    autor='MenteActiva'
                ),
                CapsulasMotivacion(
                    titulo='Manejo del Estrés',
                    contenido='Respira profundo. Eres más fuerte de lo que crees.',
                    tipo='texto',
                    autor='MenteActiva'
                ),
                CapsulasMotivacion(
                    titulo='Persistencia',
                    contenido='El éxito no es un destino, es un viaje.',
                    tipo='texto',
                    autor='MenteActiva'
                )
            ]
            db.session.add_all(capsulas)

        db.session.commit()


if __name__ == '__main__':
    # Inicializar base de datos
    init_db()

    # Ejecutar servidor
    app.run(
        debug=True,
        port=5000,
        host='0.0.0.0'
    )