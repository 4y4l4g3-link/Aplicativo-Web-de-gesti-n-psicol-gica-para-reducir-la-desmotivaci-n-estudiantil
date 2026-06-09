"""
Modelos de base de datos SQLAlchemy
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Usuario(db.Model):
    """
    Modelo de Usuario
    Roles: 'administrador', 'estudiante'
    """
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    nombre = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), default='estudiante', nullable=False)  # 'administrador' o 'estudiante'
    activo = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    emociones = db.relationship('Emocion', backref='usuario', lazy=True, cascade='all, delete-orphan')
    micro_metas = db.relationship('MicroMeta', backref='usuario', lazy=True, cascade='all, delete-orphan')
    evaluaciones_estres = db.relationship('EvaluacionEstres', backref='usuario', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hashear y establecer contraseña"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verificar contraseña"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self, include_password=False):
        """Convertir modelo a diccionario"""
        data = {
            'id': self.id,
            'email': self.email,
            'nombre': self.nombre,
            'rol': self.rol,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'fecha_actualizacion': self.fecha_actualizacion.isoformat()
        }
        return data


class Emocion(db.Model):
    """
    Modelo de Diario de Emociones
    Estados: 'muy_feliz', 'feliz', 'neutral', 'triste', 'muy_triste', 'ansioso'
    """
    __tablename__ = 'emociones'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, index=True)
    estado = db.Column(db.String(50), nullable=False)  # 'muy_feliz', 'feliz', 'neutral', 'triste', 'muy_triste', 'ansioso'
    intensidad = db.Column(db.Integer, nullable=False)  # 1-10
    notas = db.Column(db.Text, nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convertir modelo a diccionario"""
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'estado': self.estado,
            'intensidad': self.intensidad,
            'notas': self.notas,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'fecha_actualizacion': self.fecha_actualizacion.isoformat()
        }


class MicroMeta(db.Model):
    """
    Modelo de Micro-Metas
    Prioridades: 'alta', 'media', 'baja'
    Estados: 'pendiente', 'en_progreso', 'completada'
    """
    __tablename__ = 'micro_metas'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, index=True)
    titulo = db.Column(db.String(255), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    prioridad = db.Column(db.String(20), default='media', nullable=False)  # 'alta', 'media', 'baja'
    estado = db.Column(db.String(20), default='pendiente', nullable=False)  # 'pendiente', 'en_progreso', 'completada'
    progreso = db.Column(db.Integer, default=0)  # 0-100
    fecha_vencimiento = db.Column(db.DateTime, nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convertir modelo a diccionario"""
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'prioridad': self.prioridad,
            'estado': self.estado,
            'progreso': self.progreso,
            'fecha_vencimiento': self.fecha_vencimiento.isoformat() if self.fecha_vencimiento else None,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'fecha_actualizacion': self.fecha_actualizacion.isoformat()
        }


class EvaluacionEstres(db.Model):
    """
    Modelo de Evaluación de Estrés
    Niveles: 'bajo', 'moderado', 'alto'
    """
    __tablename__ = 'evaluaciones_estres'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, index=True)
    pregunta_1 = db.Column(db.Integer, nullable=False)  # 1-10
    pregunta_2 = db.Column(db.Integer, nullable=False)  # 1-10
    pregunta_3 = db.Column(db.Integer, nullable=False)  # 1-10
    puntuacion_total = db.Column(db.Integer, nullable=False)  # suma de las 3
    nivel = db.Column(db.String(20), nullable=False)  # 'bajo', 'moderado', 'alto'
    recomendacion = db.Column(db.Text, nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convertir modelo a diccionario"""
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'pregunta_1': self.pregunta_1,
            'pregunta_2': self.pregunta_2,
            'pregunta_3': self.pregunta_3,
            'puntuacion_total': self.puntuacion_total,
            'nivel': self.nivel,
            'recomendacion': self.recomendacion,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'fecha_actualizacion': self.fecha_actualizacion.isoformat()
        }


class CapsulasMotivacion(db.Model):
    """
    Modelo de Cápsulas de Motivación
    Tipos: 'audio', 'texto', 'video'
    """
    __tablename__ = 'capsulas_motivacion'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    tipo = db.Column(db.String(20), default='texto')  # 'audio', 'texto', 'video'
    duracion_segundos = db.Column(db.Integer, nullable=True)
    autor = db.Column(db.String(120), nullable=True)
    archivo_url = db.Column(db.String(255), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convertir modelo a diccionario"""
        return {
            'id': self.id,
            'titulo': self.titulo,
            'contenido': self.contenido,
            'tipo': self.tipo,
            'duracion_segundos': self.duracion_segundos,
            'autor': self.autor,
            'archivo_url': self.archivo_url,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'fecha_actualizacion': self.fecha_actualizacion.isoformat()
        }
