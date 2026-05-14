# Mostrar imágenes guardadas
@app.route('/uploads/<filename>')
def uploaded_file(filename):

    return send_from_directory(
        app.config['UPLOAD_FOLDER'],
        filename
    )


# Ejecutar servidor
if __name__ == '__main__':

    app.run(
        debug=True,
        port=5000
    )
