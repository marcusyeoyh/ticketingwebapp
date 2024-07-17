from app import create_app

# entry point for flask application

# create flask application
app = create_app()

# sets debug mode and runs the app and defines what port to run from
if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
