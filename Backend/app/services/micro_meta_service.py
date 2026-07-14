from datetime import datetime

from Backend.app.models.micro_meta_model import MicroMetaModel
from Backend.app.repositories.micro_meta_repository import MicroMetaRepository


class MicroMetaService:
    def __init__(self):
        self.repo = MicroMetaRepository()

    def create_micro_meta(self, usuario_id, data):
        meta = MicroMetaModel(
            usuario_id=usuario_id,
            titulo=data.get('titulo', '').strip(),
            descripcion=data.get('descripcion', ''),
            prioridad=data.get('prioridad', 'media'),
            estado=data.get('estado', 'pendiente'),
            progreso=data.get('progreso', 0),
            fecha_vencimiento=self._parse_fecha_vencimiento(data.get('fecha_vencimiento'))
        )
        meta = self.repo.save(meta)
        return meta.to_dict()

    def get_micro_meta(self, meta_id, usuario_id):
        meta = self.repo.find_by_id_and_user(meta_id, usuario_id)
        return meta.to_dict() if meta else None

    def list_all_micro_metas(self, usuario_id):
        metas = self.repo.find_all_by_user(usuario_id)
        return [m.to_dict() for m in metas]

    def _parse_fecha_vencimiento(self, value):
        if not value:
            return None
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            text = value.strip()
            if not text:
                return None
            if 'T' in text:
                text = text.split('T')[0]
            return datetime.strptime(text, '%Y-%m-%d')
        return None