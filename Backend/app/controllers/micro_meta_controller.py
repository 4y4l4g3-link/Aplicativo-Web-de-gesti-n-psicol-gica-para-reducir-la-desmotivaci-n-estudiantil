from flask import Blueprint, request, jsonify
from Backend.app.services.micro_meta_service import MicroMetaService
from Backend.app.utils.jwt import token_required

micro_meta_bp = Blueprint('micro_meta', __name__)
micro_meta_service = MicroMetaService()


@micro_meta_bp.route('/', methods=['POST'])
@token_required
def create_micro_meta(usuario):
    data = dict(request.json or {})
    meta = micro_meta_service.create_micro_meta(usuario.id, data)
    return jsonify(meta), 201


@micro_meta_bp.route('/<int:meta_id>', methods=['GET'])
@token_required
def get_micro_meta(usuario, meta_id):
    meta = micro_meta_service.get_micro_meta(meta_id, usuario.id)
    if meta is None:
        return jsonify({'error': 'Meta no encontrada'}), 404
    return jsonify(meta)


@micro_meta_bp.route('/', methods=['GET'])
@token_required
def list_micro_metas(usuario):
    metas = micro_meta_service.list_all_micro_metas(usuario.id)
    return jsonify(metas)
