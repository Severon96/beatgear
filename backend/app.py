import psycopg2.extras
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

import config
from api.api_bookings import api as api_bookings
from api.api_hardware import api as api_hardware
from api.api_users import api as api_users
from util.auth_util import fetch_public_key


def create_app() -> Flask:
    flask_app = Flask("backend")
    flask_app.config.from_object(config.Config)

    CORS(flask_app)

    psycopg2.extras.register_uuid()

    add_root_route(flask_app)
    add_blueprints(flask_app)

    return flask_app


def add_blueprints(flask_app):
    flask_app.register_blueprint(api_users, url_prefix="/api")
    flask_app.register_blueprint(api_hardware, url_prefix="/api")
    flask_app.register_blueprint(api_bookings, url_prefix="/api")


def add_root_route(flask_app):
    @flask_app.route("/")
    def hello_world():
        return {"hello": "world"}


if __name__ == "__main__":
    app = create_app()

    app.config['JWT_PUBLIC_KEY'] = fetch_public_key(
        app.config.get('OAUTH_ISSUER'),
        app.config.get('REALM_NAME')
    )
    JWTManager(app)

    app.run(debug=True)
