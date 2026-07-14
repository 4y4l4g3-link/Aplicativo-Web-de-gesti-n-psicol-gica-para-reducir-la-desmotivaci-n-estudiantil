"""
Configuración de la aplicación Flask (wrapper para compatibilidad)
"""
from Backend.app.config.config import config as new_config

# Reexpose the config variable for backward compatibility
config = new_config