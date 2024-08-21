import dotenv
import psycopg2.extras
from chalice import Chalice

from api.api_bookings import api as api_bookings
from api.api_hardware import api as api_hardware
from api.api_users import api as api_users

app = Chalice("backend")


@app.route("/")
def hello_world():
    return {"hello": "world"}


dotenv.load_dotenv()
psycopg2.extras.register_uuid()
app.register_blueprint(api_users, url_prefix="/api")
app.register_blueprint(api_hardware, url_prefix="/api")
app.register_blueprint(api_bookings, url_prefix="/api")
