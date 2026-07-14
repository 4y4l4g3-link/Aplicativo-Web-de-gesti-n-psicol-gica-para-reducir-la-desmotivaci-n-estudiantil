from Backend.app.database import db
from Backend.app.models.stress_model import StressModel

class StressRepository:
    def save(self, evaluacion):
        db.session.add(evaluacion)
        db.session.commit()
        return evaluacion

    def find_by_id(self, evaluacion_id):
        return db.session.get(StressModel, evaluacion_id)