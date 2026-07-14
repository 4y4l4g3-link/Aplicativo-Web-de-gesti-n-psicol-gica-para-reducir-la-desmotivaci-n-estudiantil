from Backend.app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self):
        self.repo = DashboardRepository()

    def get_summary(self, usuario_id):
        return self.repo.get_summary(usuario_id)
