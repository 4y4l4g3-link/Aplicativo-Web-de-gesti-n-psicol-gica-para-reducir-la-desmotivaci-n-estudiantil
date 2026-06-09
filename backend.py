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
from config import config
from models import db, Usuario, Emocion, MicroMeta, EvaluacionEstres, CapsulasMotivacion

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


# ==================== EMOCIONES (DIARIO) ====================

@app.route('/api/emociones', methods=['GET'])
@token_required
def listar_emociones(usuario):
    """
    Obtener todas las emociones del usuario
    GET /api/emociones
    """
    try:
        emociones = Emocion.query.filter_by(usuario_id=usuario.id).order_by(Emocion.fecha_creacion.desc()).all()
        return jsonify([e.to_dict() for e in emociones]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/emociones', methods=['POST'])
@token_required
def crear_emocion(usuario):
    """
    Crear nueva entrada de emoción
    POST /api/emociones
    {
        "estado": "feliz",
        "intensidad": 8,
        "notas": "Hoy fue un buen día"
    }
    """
    data = request.get_json()
    
    if not data or not data.get('estado') or data.get('intensidad') is None:
        return jsonify({'error': 'Estado e intensidad son requeridos'}), 400
    
    if not (1 <= data.get('intensidad', 0) <= 10):
        return jsonify({'error': 'Intensidad debe estar entre 1 y 10'}), 400
    
    try:
        nueva_emocion = Emocion(
            usuario_id=usuario.id,
            estado=data['estado'],
            intensidad=data['intensidad'],
            notas=data.get('notas', '')
        )
        
        db.session.add(nueva_emocion)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Emoción registrada',
            'emocion': nueva_emocion.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/emociones/<int:emocion_id>', methods=['GET'])
@token_required
def obtener_emocion(usuario, emocion_id):
    """
    Obtener emoción específica
    GET /api/emociones/<id>
    """
    try:
        emocion = Emocion.query.filter_by(id=emocion_id, usuario_id=usuario.id).first()
        if not emocion:
            return jsonify({'error': 'Emoción no encontrada'}), 404
        
        return jsonify(emocion.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/emociones/<int:emocion_id>', methods=['PUT'])
@token_required
def actualizar_emocion(usuario, emocion_id):
    """
    Actualizar emoción
    PUT /api/emociones/<id>
    """
    emocion = Emocion.query.filter_by(id=emocion_id, usuario_id=usuario.id).first()
    if not emocion:
        return jsonify({'error': 'Emoción no encontrada'}), 404
    
    data = request.get_json()
    
    try:
        if 'estado' in data:
            emocion.estado = data['estado']
        if 'intensidad' in data:
            if not (1 <= data['intensidad'] <= 10):
                return jsonify({'error': 'Intensidad debe estar entre 1 y 10'}), 400
            emocion.intensidad = data['intensidad']
        if 'notas' in data:
            emocion.notas = data['notas']
        
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Emoción actualizada',
            'emocion': emocion.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/emociones/<int:emocion_id>', methods=['DELETE'])
@token_required
def eliminar_emocion(usuario, emocion_id):
    """
    Eliminar emoción
    DELETE /api/emociones/<id>
    """
    emocion = Emocion.query.filter_by(id=emocion_id, usuario_id=usuario.id).first()
    if not emocion:
        return jsonify({'error': 'Emoción no encontrada'}), 404
    
    try:
        db.session.delete(emocion)
        db.session.commit()
        
        return jsonify({'mensaje': 'Emoción eliminada'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== MICRO-METAS ====================

@app.route('/api/micro-metas', methods=['GET'])
@token_required
def listar_micro_metas(usuario):
    """
    Obtener todas las micro-metas del usuario
    GET /api/micro-metas
    """
    try:
        metas = MicroMeta.query.filter_by(usuario_id=usuario.id).order_by(MicroMeta.fecha_creacion.desc()).all()
        return jsonify([m.to_dict() for m in metas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/micro-metas', methods=['POST'])
@token_required
def crear_micro_meta(usuario):
    """
    Crear nueva micro-meta
    POST /api/micro-metas
    {
        "titulo": "Estudiar capítulo 5",
        "descripcion": "Leer y resumir el capítulo",
        "prioridad": "alta",
        "fecha_vencimiento": "2024-06-20T18:00:00"
    }
    """
    data = request.get_json()
    
    if not data or not data.get('titulo'):
        return jsonify({'error': 'Título es requerido'}), 400
    
    try:
        fecha_vencimiento = None
        if data.get('fecha_vencimiento'):
            fecha_vencimiento = datetime.fromisoformat(data['fecha_vencimiento'].replace('Z', '+00:00'))
        
        nueva_meta = MicroMeta(
            usuario_id=usuario.id,
            titulo=data['titulo'],
            descripcion=data.get('descripcion', ''),
            prioridad=data.get('prioridad', 'media'),
            fecha_vencimiento=fecha_vencimiento
        )
        
        db.session.add(nueva_meta)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Micro-meta creada',
            'meta': nueva_meta.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/micro-metas/<int:meta_id>', methods=['GET'])
@token_required
def obtener_micro_meta(usuario, meta_id):
    """
    Obtener micro-meta específica
    GET /api/micro-metas/<id>
    """
    try:
        meta = MicroMeta.query.filter_by(id=meta_id, usuario_id=usuario.id).first()
        if not meta:
            return jsonify({'error': 'Micro-meta no encontrada'}), 404
        
        return jsonify(meta.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/micro-metas/<int:meta_id>', methods=['PUT'])
@token_required
def actualizar_micro_meta(usuario, meta_id):
    """
    Actualizar micro-meta
    PUT /api/micro-metas/<id>
    {
        "titulo": "Nuevo título",
        "progreso": 50,
        "estado": "en_progreso"
    }
    """
    meta = MicroMeta.query.filter_by(id=meta_id, usuario_id=usuario.id).first()
    if not meta:
        return jsonify({'error': 'Micro-meta no encontrada'}), 404
    
    data = request.get_json()
    
    try:
        if 'titulo' in data:
            meta.titulo = data['titulo']
        if 'descripcion' in data:
            meta.descripcion = data['descripcion']
        if 'prioridad' in data:
            meta.prioridad = data['prioridad']
        if 'estado' in data:
            meta.estado = data['estado']
        if 'progreso' in data:
            meta.progreso = data['progreso']
        
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Micro-meta actualizada',
            'meta': meta.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/micro-metas/<int:meta_id>', methods=['DELETE'])
@token_required
def eliminar_micro_meta(usuario, meta_id):
    """
    Eliminar micro-meta
    DELETE /api/micro-metas/<id>
    """
    meta = MicroMeta.query.filter_by(id=meta_id, usuario_id=usuario.id).first()
    if not meta:
        return jsonify({'error': 'Micro-meta no encontrada'}), 404
    
    try:
        db.session.delete(meta)
        db.session.commit()
        
        return jsonify({'mensaje': 'Micro-meta eliminada'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== EVALUACIONES DE ESTRÉS ====================

@app.route('/api/evaluaciones-estres', methods=['GET'])
@token_required
def listar_evaluaciones_estres(usuario):
    """
    Obtener todas las evaluaciones de estrés del usuario
    GET /api/evaluaciones-estres
    """
    try:
        evaluaciones = EvaluacionEstres.query.filter_by(usuario_id=usuario.id).order_by(EvaluacionEstres.fecha_creacion.desc()).all()
        return jsonify([e.to_dict() for e in evaluaciones]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/evaluaciones-estres', methods=['POST'])
@token_required
def crear_evaluacion_estres(usuario):
    """
    Crear nueva evaluación de estrés
    POST /api/evaluaciones-estres
    {
        "pregunta_1": 5,
        "pregunta_2": 6,
        "pregunta_3": 4
    }
    """
    data = request.get_json()
    
    if (not data or 
        data.get('pregunta_1') is None or 
        data.get('pregunta_2') is None or 
        data.get('pregunta_3') is None):
        return jsonify({'error': 'Las tres preguntas son requeridas'}), 400
    
    # Validar que sean números entre 1-10
    for i in [1, 2, 3]:
        valor = data.get(f'pregunta_{i}')
        if not (1 <= valor <= 10):
            return jsonify({'error': f'Pregunta {i} debe estar entre 1 y 10'}), 400
    
    try:
        puntuacion_total = data['pregunta_1'] + data['pregunta_2'] + data['pregunta_3']
        
        # Calcular nivel según puntuación (3-30)
        if puntuacion_total <= 10:
            nivel = 'bajo'
            recomendacion = 'Tu nivel de estrés es bajo. ¡Mantén estas buenas prácticas!'
        elif puntuacion_total <= 20:
            nivel = 'moderado'
            recomendacion = 'Tu nivel de estrés es moderado. Intenta usar técnicas de relajación.'
        else:
            nivel = 'alto'
            recomendacion = 'Tu nivel de estrés es alto. Considera hablar con un profesional.'
        
        nueva_evaluacion = EvaluacionEstres(
            usuario_id=usuario.id,
            pregunta_1=data['pregunta_1'],
            pregunta_2=data['pregunta_2'],
            pregunta_3=data['pregunta_3'],
            puntuacion_total=puntuacion_total,
            nivel=nivel,
            recomendacion=recomendacion
        )
        
        db.session.add(nueva_evaluacion)
        db.session.commit()
        
        return jsonify({
            'mensaje': 'Evaluación de estrés registrada',
            'evaluacion': nueva_evaluacion.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/evaluaciones-estres/<int:eval_id>', methods=['GET'])
@token_required
def obtener_evaluacion_estres(usuario, eval_id):
    """
    Obtener evaluación específica
    GET /api/evaluaciones-estres/<id>
    """
    try:
        evaluacion = EvaluacionEstres.query.filter_by(id=eval_id, usuario_id=usuario.id).first()
        if not evaluacion:
            return jsonify({'error': 'Evaluación no encontrada'}), 404
        
        return jsonify(evaluacion.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== CÁPSULAS DE MOTIVACIÓN ====================

@app.route('/api/capsulas-motivacion', methods=['GET'])
def listar_capsulas():
    """
    Obtener todas las cápsulas de motivación
    GET /api/capsulas-motivacion
    (No requiere autenticación - contenido público)
    """
    try:
        capsulas = CapsulasMotivacion.query.all()
        return jsonify([c.to_dict() for c in capsulas]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/capsulas-motivacion/<int:capsula_id>', methods=['GET'])
def obtener_capsula(capsula_id):
    """
    Obtener cápsula específica
    GET /api/capsulas-motivacion/<id>
    """
    try:
        capsula = CapsulasMotivacion.query.get(capsula_id)
        if not capsula:
            return jsonify({'error': 'Cápsula no encontrada'}), 404
        
        return jsonify(capsula.to_dict()), 200
    except Exception as e:
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
