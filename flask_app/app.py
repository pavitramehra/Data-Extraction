from flask import Flask, render_template, request
from gui import init_gui

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/uploader", methods=["POST"])
def get_file_name():
    if request.method == 'POST':
        f = request.form['filename']
        return f
if __name__ == "__main__":
    init_gui(app)