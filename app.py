from flask import Flask, render_template, request
from dbmain import main
from multiprocessing import Process
import webbrowser
import sys
import time
import os, signal

app = Flask(__name__)


def start_server():
    last_hit = time.time()
    with open(".tmp", "w") as f:
        f.write(str(last_hit))
    
    app.run()


def shutdown_server():
    server.terminate()
    os.remove(".tmp")
    sys.exit(0)


def check_time_out():
    timeout = 10
    while(True):
        current_time = time.time()

        with open(".tmp", "r") as f:
            last_hit = float(f.readline()[:-1])

        if(current_time - last_hit > timeout):
            print("closing server..")
            shutdown_server()
            break
        else:
            print("app is running..")

        time.sleep(10)



# pyinstaller -w -F --onefile --add-data "templates;templates" --add-data "static;static" app.py

@app.route("/")
def home():
    last_hit = time.time()

    with open(".tmp", "r+") as f:
        f.write(str(last_hit))

    return render_template("connection.html")

@app.route("/connector/<string:db_name>/<string:db_password>/<string:db_ip>/<string:db_port>/<string:db_sid>")
def connect_to_db(db_name,db_password,db_ip,db_port,db_sid):
    last_hit = time.time()

    with open(".tmp", "r+") as f:
        f.write(str(last_hit))

    # status = dao.auth(db_name,db_password,db_ip,db_port,db_sid)
    return {"messgae":status}

@app.route("/awake_hit")
def close_server():
    last_hit = time.time()

    with open(".tmp", "r+") as f:
        f.write(str(last_hit))

    print("awake hit, hit time : ",last_hit)
    return ""

if __name__ == "__main__":
    global dao, server, browser, check

    dao = main()

    server = Process(target=start_server)
    server.start()

    webbrowser.open_new("http://127.0.0.1:5000/")

    check = Process(target=check_time_out)
    check.start()

    server.join()
    check.join()
