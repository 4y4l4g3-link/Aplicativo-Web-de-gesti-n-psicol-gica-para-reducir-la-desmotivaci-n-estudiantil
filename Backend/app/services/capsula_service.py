from Backend.app.models.capsula_model import CapsulaModel
from Backend.app.repositories.capsula_repository import CapsulaRepository

class CapsulaService:
    def __init__(self):
        self.repo = CapsulaRepository()

    def listar_capsulas(self):
        capsulas = self.repo.find_all()
        return [c.to_dict() for c in capsulas]

    def obtener_capsula(self, capsula_id):
        capsula = self.repo.find_by_id(capsula_id)
        return capsula.to_dict() if capsula else None