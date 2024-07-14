import psycopg2.extras
from chalice import Chalice

from api.api_users import api as api_users
from api.api_hardware import api as api_hardware

app = Chalice("backend")


@app.route("/")
def hello_world():
    return {"hello": "world"}


psycopg2.extras.register_uuid()
app.register_blueprint(api_users, url_prefix="/api")
app.register_blueprint(api_hardware, url_prefix="/api")
