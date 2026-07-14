from Backend.app.models.stress_model import StressModel
from Backend.app.repositories.stress_repository import StressRepository


class StressService:
    def __init__(self):
        self.repo = StressRepository()

    def _calcular_nivel(self, puntuacion_total):
        if puntuacion_total <= 10:
            return 'bajo'
        if puntuacion_total <= 20:
            return 'moderado'
        return 'alto'

    def _generar_recomendacion(self, nivel):
        recomendaciones = {
            'bajo': 'Mantén tus hábitos saludables y sigue cuidando tu bienestar.',
            'moderado': 'Considera técnicas de relajación y organiza mejor tus tareas.',
            'alto': 'Busca apoyo y prioriza acciones de autocuidado.'
        }
        return recomendaciones.get(nivel, '')

    def crear_evaluacion(self, data):
        data = dict(data or {})

        pregunta_1 = data.get('pregunta_1')
        pregunta_2 = data.get('pregunta_2')
        pregunta_3 = data.get('pregunta_3')

        if pregunta_1 is None or pregunta_2 is None or pregunta_3 is None:
            raise ValueError('Las preguntas 1, 2 y 3 son requeridas')

        pregunta_1 = int(pregunta_1)
        pregunta_2 = int(pregunta_2)
        pregunta_3 = int(pregunta_3)

        if not 1 <= pregunta_1 <= 10 or not 1 <= pregunta_2 <= 10 or not 1 <= pregunta_3 <= 10:
            raise ValueError('Las preguntas deben estar entre 1 y 10')

        puntuacion_total = pregunta_1 + pregunta_2 + pregunta_3
        nivel = self._calcular_nivel(puntuacion_total)
        recomendacion = data.get('recomendacion') or self._generar_recomendacion(nivel)

        evaluacion = StressModel(
            usuario_id=data.get('usuario_id'),
            pregunta_1=pregunta_1,
            pregunta_2=pregunta_2,
            pregunta_3=pregunta_3,
            puntuacion_total=puntuacion_total,
            nivel=nivel,
            recomendacion=recomendacion
        )
        evaluacion = self.repo.save(evaluacion)
        return evaluacion.to_dict()

    def obtener_evaluacion(self, evaluacion_id):
        evaluacion = self.repo.find_by_id(evaluacion_id)
        return evaluacion.to_dict() if evaluacion else None