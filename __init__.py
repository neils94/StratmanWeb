from flask import Flask

def create_app():
    app = Flask(__name__)
    #Encrypt session data for website
    app.config['SECRET_KEY'] = 'empty string that is secret key to our app'
    from .views import views
    from .auth import auth
    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    return app

