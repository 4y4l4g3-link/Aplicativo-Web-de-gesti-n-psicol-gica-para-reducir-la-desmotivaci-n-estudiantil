from flask import Blueprint, request, jsonify
from Backend.app.services.capsula_service import CapsulaService

capsula_bp = Blueprint('capsula', __name__)
capsula_service = CapsulaService()

@capsula_bp.route('/', methods=['GET'])
def listar_capsulas():
    capsulas = capsula_service.listar_capsulas()
    return jsonify(capsulas)

@capsula_bp.route('/<int:capsula_id>', methods=['GET'])
def obtener_capsula(capsula_id):
    capsula = capsula_service.obtener_capsula(capsula_id)
    return jsonify(capsula)