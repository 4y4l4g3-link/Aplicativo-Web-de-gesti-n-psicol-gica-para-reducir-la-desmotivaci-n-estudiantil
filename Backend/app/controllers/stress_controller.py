from flask import Blueprint, request, jsonify
from Backend.app.services.stress_service import StressService
from Backend.app.utils.jwt import token_required

stress_bp = Blueprint('stress', __name__)
stress_service = StressService()

@stress_bp.route('/', methods=['POST'])
@token_required
def crear_evaluacion(usuario):
    data = request.json
    data = dict(data or {})
    data['usuario_id'] = usuario.id
    evaluacion = stress_service.crear_evaluacion(data)
    return jsonify(evaluacion), 201

@stress_bp.route('/<int:evaluacion_id>', methods=['GET'])
@token_required
def obtener_evaluacion(usuario, evaluacion_id):
    evaluacion = stress_service.obtener_evaluacion(evaluacion_id)
    return jsonify(evaluacion)

# Agregar otras rutas (PUT, DELETE) si es necesario