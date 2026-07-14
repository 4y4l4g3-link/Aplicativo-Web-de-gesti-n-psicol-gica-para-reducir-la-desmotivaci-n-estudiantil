from Backend.app.database import db
from Backend.app.models.capsula_model import CapsulaModel

class CapsulaRepository:
    def find_all(self):
        return db.session.query(CapsulaModel).all()

    def find_by_id(self, capsula_id):
        return db.session.get(CapsulaModel, capsula_id)