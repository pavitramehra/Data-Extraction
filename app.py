from flask import Flask, render_template, request
from gui import init_gui

app = Flask(__name__)

conncetd = False
db_name = ""

@app.route("/")
def home():
    status = "Connected to {}".format(db_name) if conncetd else "Not connected"
    return render_template("index.html", Status=status)

@app.route("/connect_to_db", methods=["POST"])
def render_connect_to_db_page():
    return render_template("connection.html")


@app.route("/connector", methods=["POST"])
def connect_to_db():
    if(request.method=="POST"):
        
        db_name = request.form["db_name"]
        dp_password = request.form["db_password"]
        db_ip = request.form["db_ip"]
        dp_port = request.form["db_port"]

        return "connect_to_db function called. Get params {},{},{},{}".format(db_name, dp_password, db_ip, dp_port)
    return ""

@app.route("/import_file", methods=["POST"])
def import_data_into_csv():
    if(request.method=="POST"):

        return "import_file function called."
    return ""

if __name__ == "__main__":
    init_gui(app)