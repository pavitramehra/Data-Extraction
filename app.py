from flask import Flask, render_template, request, jsonify, flash
from dbmain import main
import webbrowser

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
dao = main()

# pyinstaller -w -F --onefile --add-data "templates;templates" --add-data "static;static" app.py

@app.route("/", methods=["POST", "GET"])
def home():
    if(request.method == "GET"):
        return render_template("index.html")
    elif(request.method == "POST"):
        db_name = request.form["db_name"]
        db_password = request.form["db_password"]
        db_ip = request.form["db_ip"]
        db_port = request.form["db_port"]
        db_sid = request.form["db_sid"]
        status = "imported"
        flash(status)
        return render_template("index.html")


if __name__ == "__main__":

    webbrowser.open_new("http://127.0.0.1:5001/")

    app.run(port=5001)