import psycopg2.extras
from chalice import Chalice

from api.api_users import api as api_users

app = Chalice("backend")


@app.route("/")
def hello_world():
    return {"hello": "world"}


psycopg2.extras.register_uuid()
app.register_blueprint(api_users, url_prefix="/api")
