from flask import Flask, render_template, request
from gui import init_gui
from dbmain import main

import tkinter as tk
from tkinter import filedialog

app = Flask(__name__)



@app.route("/")
def home():
    status = "Connected to {}".format(db_name) if dao.get_status()=="connected" else "Not connected"
    return render_template("index.html", Status=status)

@app.route("/connect_to_db", methods=["POST"])
def render_connect_to_db_page():
    return render_template("connection.html")


@app.route("/connector", methods=["POST"])
def connect_to_db():
    if(request.method=="POST"):
        
        db_name = request.form["db_name"]
        db_password = request.form["db_password"]
        db_ip = request.form["db_ip"]
        db_port = request.form["db_port"]

        dao.auth(db_name,db_password,db_ip,db_port,'xe')

    status = "Connected to {}".format(db_name) if dao.get_status()=="Connected" else "Not connected"
    return render_template("index.html", Status=status)

@app.route("/import_file", methods=["POST"])
def import_data_into_csv():
    status = "Connected to {}".format(db_name) if dao.get_status()=="connected" else "Not connected"
    if(request.method=="POST"):
        source_file_name = request.form["source_file_text"]
        destination_file_name = request.form["destination_file_text"]
        
        status = dao.service(source_file_name, destination_file_name)

    return render_template("index.html", Status=status)

@app.route("/file_path")
def get_file_path():
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename()
    root.destroy()

    return file_path if isinstance(file_path, str) else ""

@app.route("/dir_path")
def get_dir_path():
    root = tk.Tk()
    root.withdraw()
    dir_path = filedialog.askdirectory()
    root.destroy()

    return (dir_path + ("/" if dir_path[-1]!='/' else ""))if isinstance(dir_path, str) else ""


if __name__ == "__main__":
    global dao, db_name
    dao = main()
    db_name = dao.get_db_name()
    init_gui(app)