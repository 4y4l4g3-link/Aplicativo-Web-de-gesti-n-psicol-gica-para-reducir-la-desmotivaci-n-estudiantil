from Backend.app.database import db
from Backend.app.models.micro_meta_model import MicroMetaModel


class MicroMetaRepository:
    def save(self, meta):
        db.session.add(meta)
        db.session.commit()
        return meta

    def find_by_id_and_user(self, meta_id, usuario_id):
        return MicroMetaModel.query.filter_by(id=meta_id, usuario_id=usuario_id).first()

    def find_all_by_user(self, usuario_id):
        return MicroMetaModel.query.filter_by(usuario_id=usuario_id).order_by(MicroMetaModel.fecha_creacion.desc()).all()