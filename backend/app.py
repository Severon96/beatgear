import dotenv
import psycopg2.extras
from flask import Flask
from flask_cors import CORS

from api.api_bookings import api as api_bookings
from api.api_hardware import api as api_hardware
from api.api_users import api as api_users


def create_app() -> Flask:
    flask_app = Flask("backend")

    CORS(flask_app)

    @flask_app.route("/")
    def hello_world():
        return {"hello": "world"}

    dotenv.load_dotenv()
    psycopg2.extras.register_uuid()
    flask_app.register_blueprint(api_users, url_prefix="/api")
    flask_app.register_blueprint(api_hardware, url_prefix="/api")
    flask_app.register_blueprint(api_bookings, url_prefix="/api")

    return flask_app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)