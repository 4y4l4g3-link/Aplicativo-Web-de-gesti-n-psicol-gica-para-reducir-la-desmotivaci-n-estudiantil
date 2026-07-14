"""
Configuración de la aplicación Flask
"""
import os
from datetime import timedelta

# Directorio base
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

class Config:
    """Configuración base"""
    # Base de datos SQLite
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(BASE_DIR, "menteactiva.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'tu-clave-secreta-muy-segura-para-desarrollo'
    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)

    # Archivos
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB máximo

    # CORS
    CORS_ORIGINS = ['http://localhost:4200', 'http://localhost:3000']

class DevelopmentConfig(Config):
    """Configuración de desarrollo"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Configuración de producción"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Configuración de testing"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Seleccionar configuración según entorno
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}