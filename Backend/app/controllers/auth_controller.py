def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('nombre'):
        return jsonify({'error': 'Email, nombre y contraseña son requeridos'}), 400
    
    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 409
    
    try:
        nuevo_usuario = Usuario(
            email=data['email'],
            nombre=data['nombre'],
            rol='estudiante'
        )
        nuevo_usuario.set_password(data['password'])
        db.session.add(nuevo_usuario)
        db.session.commit()
        token = generar_token(nuevo_usuario.id)
        return jsonify({
            'mensaje': 'Usuario registrado exitosamente',
            'usuario': nuevo_usuario.to_dict(),
            'token': token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email y contraseña son requeridos'}), 400
    
    usuario = Usuario.query.filter_by(email=data['email']).first()
    
    if not usuario or not usuario.check_password(data['password']):
        return jsonify({'error': 'Email o contraseña inválidos'}), 401
    
    if not usuario.activo:
        return jsonify({'error': 'Usuario inactivo'}), 403
    
    token = generar_token(usuario.id)
    return jsonify({
        'mensaje': 'Sesión iniciada',
        'usuario': usuario.to_dict(),
        'token': token
    }), 200

def get_current_user(usuario):
    return jsonify(usuario.to_dict()), 200