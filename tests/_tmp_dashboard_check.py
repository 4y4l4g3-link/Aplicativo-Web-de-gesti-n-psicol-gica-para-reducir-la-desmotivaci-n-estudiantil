import json
from backend import app, db, generar_token, init_db
from models import Usuario, Emocion, MicroMeta, EvaluacionEstres

with app.app_context():
    db.drop_all()
    db.create_all()
    init_db()
    usuario = Usuario.query.filter_by(email='test@email.com').first()
    token = generar_token(usuario.id)
    db.session.add(Emocion(usuario_id=usuario.id, estado='feliz', intensidad=7, notas='ok'))
    db.session.add(MicroMeta(usuario_id=usuario.id, titulo='A', descripcion='x', estado='completada'))
    db.session.add(MicroMeta(usuario_id=usuario.id, titulo='B', descripcion='y', estado='pendiente'))
    db.session.add(EvaluacionEstres(usuario_id=usuario.id, pregunta_1=2, pregunta_2=3, pregunta_3=4, puntuacion_total=9, nivel='bajo', recomendacion='r'))
    db.session.commit()

client = app.test_client()
resp = client.get('/api/dashboard', headers={'Authorization': f'Bearer {token}'})
print('STATUS:', resp.status_code)
print('BODY:', json.dumps(resp.get_json(), ensure_ascii=False))