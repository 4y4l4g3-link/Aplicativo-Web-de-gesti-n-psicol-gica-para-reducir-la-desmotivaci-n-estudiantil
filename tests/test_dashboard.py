import pytest

from backend import app, db, generar_token, init_db
from models import Usuario, Emocion, MicroMeta, EvaluacionEstres


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.app_context():
        db.drop_all()
        db.create_all()
        init_db()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_dashboard_endpoint_returns_summary(client):
    with app.app_context():
        usuario = Usuario.query.filter_by(email='test@email.com').first()
        token = generar_token(usuario.id)

        db.session.add(Emocion(usuario_id=usuario.id, estado='feliz', intensidad=7, notas='Muy bien'))
        db.session.add(MicroMeta(usuario_id=usuario.id, titulo='Estudiar', descripcion='Repasar', estado='completada'))
        db.session.add(MicroMeta(usuario_id=usuario.id, titulo='Leer', descripcion='Leer capítulo', estado='pendiente'))
        db.session.add(EvaluacionEstres(usuario_id=usuario.id, pregunta_1=2, pregunta_2=3, pregunta_3=4, puntuacion_total=9, nivel='bajo', recomendacion='Descansar'))
        db.session.commit()

    response = client.get('/api/dashboard', headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 200
    payload = response.get_json()
    assert payload['emociones'] == 1
    assert payload['micro_metas'] == 2
    assert payload['micro_metas_completadas'] == 1
    assert payload['capsulas'] >= 1
    assert payload['ultimo_nivel_estres'] == 'Bajo'
