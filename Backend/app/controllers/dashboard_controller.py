from flask import Blueprint, jsonify
from Backend.app.services.dashboard_service import DashboardService
from Backend.app.utils.jwt import token_required


dashboard_bp = Blueprint('dashboard', __name__)
dashboard_service = DashboardService()


@dashboard_bp.route('', methods=['GET'])
@token_required
def get_dashboard(usuario):
    summary = dashboard_service.get_summary(usuario.id)
    return jsonify(summary)
