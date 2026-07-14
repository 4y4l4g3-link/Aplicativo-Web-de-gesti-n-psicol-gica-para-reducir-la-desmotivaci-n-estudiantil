from models import db, Emocion, MicroMeta, EvaluacionEstres, CapsulasMotivacion


class DashboardRepository:
    def get_summary(self, usuario_id):
        emociones = Emocion.query.filter_by(usuario_id=usuario_id).count()
        micro_metas = MicroMeta.query.filter_by(usuario_id=usuario_id).count()
        micro_metas_completadas = MicroMeta.query.filter_by(
            usuario_id=usuario_id,
            estado='completada'
        ).count()
        capsulas = CapsulasMotivacion.query.count()

        ultima_evaluacion = (
            EvaluacionEstres.query.filter_by(usuario_id=usuario_id)
            .order_by(EvaluacionEstres.id.desc())
            .first()
        )

        return {
            'emociones': emociones,
            'micro_metas': micro_metas,
            'micro_metas_completadas': micro_metas_completadas,
            'capsulas': capsulas,
            'ultimo_nivel_estres': self._format_nivel(
                ultima_evaluacion.nivel if ultima_evaluacion else None
            )
        }

    @staticmethod
    def _format_nivel(nivel):
        if not nivel:
            return 'Sin registros'
        return nivel.replace('_', ' ').title()
